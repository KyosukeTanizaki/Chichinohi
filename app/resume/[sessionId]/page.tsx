'use client'

import { useEffect, useState, use } from 'react'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { ResumeContent } from '@/lib/supabase'

type Props = { params: Promise<{ sessionId: string }> }

type ResumeData = {
  id: string
  content: ResumeContent
  generated_at: string
  session?: { father_name: string; child_name: string }
}

export default function ResumePage({ params }: Props) {
  const { sessionId } = use(params)
  const [resume, setResume] = useState<ResumeData | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')
  const [revealed, setRevealed] = useState(false)
  const [showMessage, setShowMessage] = useState(false)

  useEffect(() => {
    const fetchResume = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/resume?session_id=${sessionId}`)
        const json = await res.json()
        if (res.ok && json.resume) {
          setResume(json.resume)
        } else {
          setError('no_answers')
        }
      } catch {
        setError('通信エラーが発生しました。')
      } finally {
        setLoading(false)
      }
    }
    fetchResume()
  }, [sessionId])

  const handleGenerate = async () => {
    setGenerating(true)
    setError('')
    try {
      const res = await fetch(`/api/resume?session_id=${sessionId}`)
      const json = await res.json()
      if (res.ok && json.resume) {
        setResume(json.resume)
      } else {
        setError(json.error || '生成できませんでした。')
      }
    } finally {
      setGenerating(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-stone-50 flex items-center justify-center">
        <p className="text-stone-400 text-sm animate-pulse">履歴書を開いています...</p>
      </main>
    )
  }

  if (error === 'no_answers') {
    return (
      <main className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="text-4xl mb-4">📭</div>
          <h1 className="text-xl font-light text-stone-700 mb-3">まだ回答が届いていません</h1>
          <p className="text-sm text-stone-400 leading-relaxed mb-6">
            お父さんが質問に答えると、ここに履歴書が完成します。<br />
            父の日（6月21日）にもう一度開いてみてください。
          </p>
          <Button
            onClick={handleGenerate}
            disabled={generating}
            variant="outline"
            className="text-stone-600 border-stone-300"
          >
            {generating ? '生成中...' : '今すぐ生成を試みる（デモ用）'}
          </Button>
          {error && error !== 'no_answers' && (
            <p className="text-xs text-red-400 mt-3">{error}</p>
          )}
        </div>
      </main>
    )
  }

  if (!resume) return null

  const { chapters, message_to_child } = resume.content

  if (!revealed) {
    return (
      <main className="min-h-screen bg-stone-900 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <p className="text-xs tracking-[0.3em] text-stone-500 uppercase mb-6">Father&apos;s Day</p>
          <h1 className="text-3xl font-light text-white mb-4">父の履歴書</h1>
          <p className="text-sm text-stone-400 leading-relaxed mb-10">
            30日間のインタビューが完成しました。<br />
            あなたの知らなかったお父さんがいます。
          </p>
          <Button
            onClick={() => setRevealed(true)}
            className="bg-white text-stone-900 hover:bg-stone-100 px-8"
          >
            開封する
          </Button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-stone-50 px-4 py-16">
      <div className="max-w-2xl mx-auto">
        {/* タイトル */}
        <div className="text-center mb-16">
          <p className="text-xs tracking-[0.3em] text-stone-400 uppercase mb-4">履歴書</p>
          <h1 className="text-4xl font-light text-stone-800 mb-2">
            {/* father_nameはAPIから取れないので章の内容で代替 */}
            父の履歴書
          </h1>
          <p className="text-sm text-stone-400">
            {new Date(resume.generated_at).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })} 完成
          </p>
        </div>

        {/* 章ごとに表示 */}
        {chapters.map((chapter, i) => (
          <section key={i} className="mb-14">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-xs text-stone-400 font-mono">0{i + 1}</span>
              <h2 className="text-lg font-medium text-stone-700">{chapter.title}</h2>
              <div className="flex-1 h-px bg-stone-200" />
            </div>

            {/* アイテムリスト */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
              {chapter.items.map((item, j) => (
                <div key={j} className="bg-white border border-stone-100 rounded-lg p-4">
                  <p className="text-xs text-stone-400 mb-1">{item.label}</p>
                  <p className="text-sm text-stone-700">{item.value}</p>
                </div>
              ))}
            </div>

            {/* ナラティブ */}
            <div className="border-l-2 border-stone-200 pl-4">
              <p className="text-sm text-stone-500 leading-relaxed italic">{chapter.narrative}</p>
            </div>
          </section>
        ))}

        <Separator className="my-12 bg-stone-200" />

        {/* 子へのメッセージ（最終セクション） */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <Badge className="bg-rose-50 text-rose-700 border-rose-100 text-xs">
              あなたへ
            </Badge>
          </div>

          {!showMessage ? (
            <div className="text-center">
              <p className="text-sm text-stone-500 mb-6 leading-relaxed">
                お父さんからのメッセージがあります。<br />
                準備ができたら開いてください。
              </p>
              <Button
                onClick={() => setShowMessage(true)}
                className="bg-rose-600 hover:bg-rose-700 text-white px-8"
              >
                メッセージを読む
              </Button>
            </div>
          ) : (
            <div className="bg-white border border-rose-100 rounded-xl p-8 shadow-sm">
              <p className="text-stone-700 leading-loose text-base whitespace-pre-wrap">
                {message_to_child.text}
              </p>
            </div>
          )}
        </section>

        {/* フッター */}
        <div className="text-center">
          <p className="text-xs text-stone-300">
            父の履歴書 — AIが作る、父と子の新しい父の日
          </p>
        </div>
      </div>
    </main>
  )
}
