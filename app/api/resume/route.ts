import { NextRequest, NextResponse } from 'next/server'
import { supabase, ResumeContent } from '@/lib/supabase'
import { generateText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'

// 履歴書を生成（セッションIDまたは招待トークンから）
export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('session_id')
  const token = req.nextUrl.searchParams.get('token')

  let session: { id: string; child_name: string; father_name: string; father_birth_year: number | null; father_birthplace: string | null; father_job: string | null } | null = null

  if (sessionId) {
    const { data } = await supabase.from('sessions').select('*').eq('id', sessionId).single()
    session = data
  } else if (token) {
    const { data } = await supabase.from('sessions').select('*').eq('invite_token', token).single()
    session = data
  }

  if (!session) return NextResponse.json({ error: 'session not found' }, { status: 404 })

  // キャッシュされた履歴書があれば返す
  const { data: cached } = await supabase
    .from('resumes')
    .select('*')
    .eq('session_id', session.id)
    .single()

  if (cached) return NextResponse.json({ resume: cached })

  // 全回答を取得
  const { data: answers } = await supabase
    .from('answers')
    .select('day_number, question, answer')
    .eq('session_id', session.id)
    .not('answer', 'is', null)
    .order('day_number', { ascending: true })

  if (!answers || answers.length === 0) {
    return NextResponse.json({ error: 'no answers yet' }, { status: 400 })
  }

  // AIで履歴書を生成
  const qaPairs = answers.map(a => `Q: ${a.question}\nA: ${a.answer}`).join('\n\n')

  const { text } = await generateText({
    model: anthropic('claude-3-5-sonnet-20241022'),
    prompt: `あなたは「父の履歴書」を美しく構成するAIエディターです。

以下は${session.father_name}さん（${session.father_birth_year ?? ''}年生まれ、${session.father_birthplace ?? ''}出身、${session.father_job ?? ''}）への30日間のインタビュー回答です。

${qaPairs}

これをもとに、子供（${session.child_name}さん）に届ける「父の履歴書」をJSONで生成してください。

出力形式（必ずこのJSON形式で出力）:
{
  "chapters": [
    {
      "title": "少年時代",
      "items": [
        { "label": "生まれた場所", "value": "..." },
        { "label": "子供のころの夢", "value": "..." }
      ],
      "narrative": "インタビューから読み取れる、この時代の父の姿を2-3文で詩的に語る文章"
    },
    {
      "title": "青春と挑戦",
      "items": [...],
      "narrative": "..."
    },
    {
      "title": "仕事と転機",
      "items": [...],
      "narrative": "..."
    },
    {
      "title": "父として",
      "items": [...],
      "narrative": "..."
    }
  ],
  "message_to_child": {
    "text": "インタビューの最後の言葉、または回答全体から読み取れる子供への本音のメッセージ。感情的で、直接的で、父の言葉らしい文体で。200文字程度。"
  }
}

ルール：
- narrativeは詩的で感情的な文体で書く
- 回答がない項目はskipする
- message_to_childは父の言葉として書く（「お父さんは...」ではなく「俺は...」「私は...」）
- JSONのみ出力（コードブロックなし）`,
    maxOutputTokens: 2000,
  })

  let content: ResumeContent
  try {
    content = JSON.parse(text.trim()) as ResumeContent
  } catch {
    return NextResponse.json({ error: 'failed to parse resume' }, { status: 500 })
  }

  const { data: resume, error } = await supabase
    .from('resumes')
    .insert({ session_id: session.id, content })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ resume })
}
