-- 子が入力した父の基本情報 + セッション管理
create table sessions (
  id uuid primary key default gen_random_uuid(),
  child_name text not null,
  father_name text not null,
  father_birth_year integer,
  father_birthplace text,
  father_job text,
  invite_token text unique not null default encode(gen_random_bytes(16), 'hex'),
  created_at timestamptz default now()
);

-- 父への質問と回答
create table answers (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references sessions(id) on delete cascade,
  day_number integer not null,
  question text not null,
  answer text,
  answered_at timestamptz,
  created_at timestamptz default now()
);

-- 生成された履歴書
create table resumes (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references sessions(id) on delete cascade unique,
  content jsonb not null,
  generated_at timestamptz default now()
);

-- Row Level Security（公開アクセス許可：デモ用）
alter table sessions enable row level security;
alter table answers enable row level security;
alter table resumes enable row level security;

create policy "allow all" on sessions for all using (true) with check (true);
create policy "allow all" on answers for all using (true) with check (true);
create policy "allow all" on resumes for all using (true) with check (true);
