'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

type Props = {
  token: string
  sessionId: string
  fatherName: string
  childName: string
}

export default function InviteCreated({ token, sessionId, fatherName, childName }: Props) {
  const [copied, setCopied] = useState(false)
  const inviteUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/invite/${token}`
  const resumeUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/resume/${sessionId}`

  const handleCopy = async () => {
    await navigator.clipboard.writeText(inviteUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main className="min-h-screen bg-stone-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-10">
          <div className="text-4xl mb-4">✉️</div>
          <h1 className="text-2xl font-light text-stone-800 mb-3">
            {fatherName}さんへの招待リンクができました
          </h1>
          <p className="text-sm text-stone-500 leading-relaxed">
            このリンクを{fatherName}さんに送ってください。<br />
            AIが毎日1問インタビューします。
          </p>
        </div>

        <Card className="border-stone-200 shadow-sm mb-6">
          <CardContent className="pt-6">
            <p className="text-xs text-stone-400 mb-2">お父さんへ送るリンク</p>
            <div className="bg-stone-100 rounded p-3 text-sm text-stone-700 break-all mb-3 font-mono">
              {inviteUrl}
            </div>
            <Button
              onClick={handleCopy}
              className="w-full bg-stone-800 hover:bg-stone-700 text-white"
            >
              {copied ? 'コピーしました！' : 'リンクをコピー'}
            </Button>
          </CardContent>
        </Card>

        <div className="bg-stone-100 rounded-lg p-4 text-sm text-stone-600 leading-relaxed mb-6">
          <p className="font-medium text-stone-700 mb-2">あなたはこれで待つだけです</p>
          <ul className="space-y-1 text-xs text-stone-500">
            <li>• お父さんが回答するたび、記録が積み重なっていきます</li>
            <li>• 父の日（6月21日）に「履歴書」が完成します</li>
            <li>• 回答が始まったらあなたには見えません（父の日まで封印）</li>
          </ul>
        </div>

        <div className="text-center">
          <p className="text-xs text-stone-400 mb-2">父の日当日に開く「履歴書ページ」</p>
          <a
            href={resumeUrl}
            className="text-xs text-stone-500 underline underline-offset-2"
          >
            {resumeUrl}
          </a>
          <p className="text-xs text-stone-400 mt-1">（今開いても何も表示されません）</p>
        </div>
      </div>
    </main>
  )
}
