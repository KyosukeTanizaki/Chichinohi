import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// 回答を保存
export async function POST(req: NextRequest) {
  const body = await req.json()
  const { token, day_number, answer } = body

  if (!token || !day_number || !answer?.trim()) {
    return NextResponse.json({ error: 'token, day_number, answer are required' }, { status: 400 })
  }

  const { data: session } = await supabase
    .from('sessions')
    .select('id')
    .eq('invite_token', token)
    .single()

  if (!session) return NextResponse.json({ error: 'session not found' }, { status: 404 })

  const { error } = await supabase
    .from('answers')
    .update({ answer: answer.trim(), answered_at: new Date().toISOString() })
    .eq('session_id', session.id)
    .eq('day_number', day_number)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
