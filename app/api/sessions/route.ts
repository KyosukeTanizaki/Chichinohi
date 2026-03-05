import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { BASE_QUESTIONS } from '@/lib/questions'

// セッション作成（子が父の情報を入力する）
export async function POST(req: NextRequest) {
  const body = await req.json()
  const { child_name, father_name, father_birth_year, father_birthplace, father_job } = body

  if (!child_name || !father_name) {
    return NextResponse.json({ error: 'child_name and father_name are required' }, { status: 400 })
  }

  const { data: session, error } = await supabase
    .from('sessions')
    .insert({ child_name, father_name, father_birth_year, father_birthplace, father_job })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // 全30問を事前にDBに登録
  const answersToInsert = BASE_QUESTIONS.map(q => ({
    session_id: session.id,
    day_number: q.day,
    question: q.question,
  }))

  await supabase.from('answers').insert(answersToInsert)

  return NextResponse.json({ session }, { status: 201 })
}
