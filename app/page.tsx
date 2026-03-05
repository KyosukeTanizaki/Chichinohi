'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import InviteCreated from '@/components/invite-created'

export default function Home() {
  const [step, setStep] = useState<'form' | 'done'>('form')
  const [loading, setLoading] = useState(false)
  const [inviteToken, setInviteToken] = useState('')
  const [sessionId, setSessionId] = useState('')
  const [fatherName, setFatherName] = useState('')
  const [form, setForm] = useState({
    child_name: '',
    father_name: '',
    father_birth_year: '',
    father_birthplace: '',
    father_job: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          father_birth_year: form.father_birth_year ? parseInt(form.father_birth_year) : null,
        }),
      })
      const data = await res.json()
      if (data.session) {
        setInviteToken(data.session.invite_token)
        setSessionId(data.session.id)
        setFatherName(data.session.father_name)
        setStep('done')
      }
    } finally {
      setLoading(false)
    }
  }

  if (step === 'done') {
    return (
      <InviteCreated
        token={inviteToken}
        sessionId={sessionId}
        fatherName={fatherName}
        childName={form.child_name}
      />
    )
  }

  return (
    <main className="min-h-screen bg-stone-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-10">
          <p className="text-xs tracking-[0.3em] text-stone-400 uppercase mb-3">Father&apos;s Day 2026</p>
          <h1 className="text-3xl font-light text-stone-800 mb-3">父の履歴書</h1>
          <p className="text-sm text-stone-500 leading-relaxed">
            お父さんのことを、役割ではなく<br />
            <span className="font-medium text-stone-700">一人の人間として</span>、知ってみませんか。
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 mb-8 text-sm text-amber-800 leading-relaxed">
          <p className="font-medium mb-1">どんな体験？</p>
          <p>AIがお父さんに30日間・毎日1問インタビューします。父の日当日、あなたに「お父さんの履歴書」が届きます。</p>
        </div>

        <Card className="border-stone-200 shadow-sm">
          <CardHeader className="pb-4">
            <p className="text-sm text-stone-500">お父さんのことを教えてください</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="child_name" className="text-stone-600 text-sm">
                  あなたの名前 <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="child_name"
                  placeholder="田中 花子"
                  value={form.child_name}
                  onChange={e => setForm(f => ({ ...f, child_name: e.target.value }))}
                  required
                  className="border-stone-200"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="father_name" className="text-stone-600 text-sm">
                  お父さんの名前 <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="father_name"
                  placeholder="田中 一郎"
                  value={form.father_name}
                  onChange={e => setForm(f => ({ ...f, father_name: e.target.value }))}
                  required
                  className="border-stone-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="father_birth_year" className="text-stone-600 text-sm">生まれた年（任意）</Label>
                  <Input
                    id="father_birth_year"
                    placeholder="1962"
                    type="number"
                    min="1930"
                    max="1990"
                    value={form.father_birth_year}
                    onChange={e => setForm(f => ({ ...f, father_birth_year: e.target.value }))}
                    className="border-stone-200"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="father_birthplace" className="text-stone-600 text-sm">出身地（任意）</Label>
                  <Input
                    id="father_birthplace"
                    placeholder="熊本県"
                    value={form.father_birthplace}
                    onChange={e => setForm(f => ({ ...f, father_birthplace: e.target.value }))}
                    className="border-stone-200"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="father_job" className="text-stone-600 text-sm">職業（任意）</Label>
                <Input
                  id="father_job"
                  placeholder="会社員（製造業）"
                  value={form.father_job}
                  onChange={e => setForm(f => ({ ...f, father_job: e.target.value }))}
                  className="border-stone-200"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-stone-800 hover:bg-stone-700 text-white mt-2"
              >
                {loading ? '準備中...' : 'お父さんへの招待リンクを作る'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-stone-400 mt-6">
          父の日は6月第3日曜日。2026年は6月21日です。
        </p>
      </div>
    </main>
  )
}
