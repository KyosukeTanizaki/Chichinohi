import { createClient, SupabaseClient } from '@supabase/supabase-js'

export type Session = {
  id: string
  child_name: string
  father_name: string
  father_birth_year: number | null
  father_birthplace: string | null
  father_job: string | null
  invite_token: string
  created_at: string
}

export type Answer = {
  id: string
  session_id: string
  day_number: number
  question: string
  answer: string | null
  answered_at: string | null
  created_at: string
}

export type ResumeContent = {
  chapters: {
    title: string
    items: { label: string; value: string }[]
    narrative: string
  }[]
  message_to_child: {
    text: string
  }
}

export type Resume = {
  id: string
  session_id: string
  content: ResumeContent
  generated_at: string
}

// 実行時に初期化（ビルド時のenv未設定エラーを回避）
let _client: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
  if (!_client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key) throw new Error('Supabase env vars are not set')
    _client = createClient(url, key)
  }
  return _client
}

// 後方互換のエイリアス（APIルートで使用）
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return getSupabase()[prop as keyof SupabaseClient]
  },
})
