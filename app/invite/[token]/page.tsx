'use client'

import { useEffect, useState, use } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'

type QuestionData = {
  session: { father_name: string; child_name: string }
  current_day: number
  total_days: number
  question: string
  answered_count: number
  completed: boolean
}

type Props = { params: Promise<{ token: string }> }

export default function InvitePage({ params }: Props) {
  const { token } = use(params)
  const [data, setData] = useState<QuestionData | null>(null)
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const fetchQuestion = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/questions?token=${token}`)
      const json = await res.json()
      if (res.ok) setData(json)
      else setError('セッションが見つかりません。')
    } catch {
      setError('通信エラーが発生しました。')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchQuestion() }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!answer.trim() || !data) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/answers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, day_number: data.current_day, answer }),
      })
      if (res.ok) {
        setSubmitted(true)
        setAnswer('')
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-stone-50 flex items-center justify-center">
        <p className="text-stone-400 text-sm">読み込み中...</p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
        <p className="text-stone-500 text-sm">{error}</p>
      </main>
    )
  }

  if (!data) return null

  if (data.completed) {
    return (
      <main className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
        <div className="w-full max-w-lg text-center">
          <div className="text-5xl mb-6">📖</div>
          <h1 className="text-2xl font-light text-stone-800 mb-3">
            すべての質問に答えていただきました
          </h1>
          <p className="text-sm text-stone-500 leading-relaxed">
            {data.session.child_name}さんへの「履歴書」が<br />
            父の日（6月21日）に届きます。
          </p>
        </div>
      </main>
    )
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
        <div className="w-full max-w-lg text-center">
          <div className="text-5xl mb-6">✅</div>
          <h1 className="text-xl font-light text-stone-800 mb-3">
            今日の回答が届きました
          </h1>
          <p className="text-sm text-stone-500 leading-relaxed mb-6">
            {data.answered_count + 1} / 30 問目が完了しました。<br />
            また明日、次の質問が届きます。
          </p>
          <p className="text-xs text-stone-400">
            {data.session.child_name}さんは父の日まで内容を見られません。<br />
            あなたの言葉は封印されています。
          </p>
        </div>
      </main>
    )
  }

  const phaseLabel = data.current_day <= 8 ? '事実の層' : data.current_day <= 20 ? '感情の層' : '子への層'
  const phaseColor = data.current_day <= 8 ? 'bg-blue-100 text-blue-700' : data.current_day <= 20 ? 'bg-orange-100 text-orange-700' : 'bg-rose-100 text-rose-700'

  return (
    <main className="min-h-screen bg-stone-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <p className="text-xs tracking-[0.3em] text-stone-400 uppercase mb-2">
            {data.session.father_name}さんへ
          </p>
          <h1 className="text-2xl font-light text-stone-800 mb-1">今日の質問</h1>
          <p className="text-xs text-stone-400">
            {data.session.child_name}さんが、あなたのことを知りたいと言っています。
          </p>
        </div>

        {/* 進捗 */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-stone-400">{data.answered_count} / {data.total_days} 問完了</span>
            <Badge className={`text-xs ${phaseColor} border-0`}>{phaseLabel}</Badge>
          </div>
          <Progress value={(data.answered_count / data.total_days) * 100} className="h-1.5" />
        </div>

        {/* 質問カード */}
        <Card className="border-stone-200 shadow-sm mb-6">
          <CardContent className="pt-6 pb-4">
            <div className="text-xs text-stone-400 mb-3">
              第 {data.current_day} 問
            </div>
            <p className="text-stone-800 leading-relaxed text-base font-medium">
              {data.question}
            </p>
          </CardContent>
        </Card>

        {/* 回答フォーム */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="思い出したことを、自由に書いてください。短くても大丈夫です。"
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            className="border-stone-200 min-h-[140px] resize-none text-stone-700 placeholder:text-stone-300"
          />
          <Button
            type="submit"
            disabled={submitting || !answer.trim()}
            className="w-full bg-stone-800 hover:bg-stone-700 text-white"
          >
            {submitting ? '送信中...' : '今日の回答を送る'}
          </Button>
        </form>

        <p className="text-center text-xs text-stone-400 mt-6">
          あなたの回答は父の日まで封印されます。{data.session.child_name}さんには見えません。
        </p>
      </div>
    </main>
  )
}
