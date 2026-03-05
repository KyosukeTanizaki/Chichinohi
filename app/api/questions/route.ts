import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { generateText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { getDefaultQuestion } from '@/lib/questions'

// 現在の質問を取得（招待トークンから）
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  if (!token) return NextResponse.json({ error: 'token required' }, { status: 400 })

  const { data: session } = await supabase
    .from('sessions')
    .select('*')
    .eq('invite_token', token)
    .single()

  if (!session) return NextResponse.json({ error: 'session not found' }, { status: 404 })

  // 回答済みの数を確認
  const { data: answeredList } = await supabase
    .from('answers')
    .select('day_number, question, answer')
    .eq('session_id', session.id)
    .not('answer', 'is', null)
    .order('day_number', { ascending: true })

  const answeredCount = answeredList?.length ?? 0
  const nextDayNumber = answeredCount + 1

  if (nextDayNumber > 30) {
    return NextResponse.json({ completed: true, total: 30 })
  }

  // 次の質問をDBから取得
  const { data: nextQuestion } = await supabase
    .from('answers')
    .select('day_number, question')
    .eq('session_id', session.id)
    .eq('day_number', nextDayNumber)
    .single()

  let questionText = nextQuestion?.question ?? getDefaultQuestion(nextDayNumber)

  // 前の回答がある場合、AIが掘り下げ質問を動的生成（Day 2以降）
  if (nextDayNumber > 1 && answeredList && answeredList.length > 0) {
    const lastAnswer = answeredList[answeredList.length - 1]
    if (lastAnswer.answer && lastAnswer.answer.length > 20) {
      try {
        const { text } = await generateText({
          model: anthropic('claude-3-5-sonnet-20241022'),
          prompt: `あなたは「父の履歴書」を作るAIインタビュアーです。
父親（${session.father_name}さん、${session.father_birth_year ?? '年齢不明'}年生まれ）に対して、前回の回答を受けて次の質問を生成してください。

前回の質問：${lastAnswer.question}
前回の回答：${lastAnswer.answer}

今回の質問（デフォルト）：${questionText}

ルール：
- デフォルト質問の趣旨を生かしながら、前回の回答に自然につながる質問にしてください
- 質問は1文で、丁寧な日本語で、60文字以内にしてください
- 回答者が答えやすいよう、具体的なエピソードを引き出す質問にしてください
- 質問文だけ出力してください（他の文言は不要）`,
          maxOutputTokens: 100,
        })
        if (text.trim()) questionText = text.trim()
      } catch {
        // AI生成失敗時はデフォルト質問を使用
      }
    }
  }

  // 動的生成した質問でDBを更新
  if (questionText !== nextQuestion?.question) {
    await supabase
      .from('answers')
      .update({ question: questionText })
      .eq('session_id', session.id)
      .eq('day_number', nextDayNumber)
  }

  return NextResponse.json({
    session: { father_name: session.father_name, child_name: session.child_name },
    current_day: nextDayNumber,
    total_days: 30,
    question: questionText,
    answered_count: answeredCount,
    completed: false,
  })
}
