-- Fluent Path: Supabaseスキーマ
-- Supabaseダッシュボード > SQL Editor に貼り付けて一度だけ実行してください。

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  marketing_opt_in boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.progress enable row level security;

-- 各ユーザーは自分の行しか読み書きできない
create policy "own profile" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "own progress" on public.progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 新規サインアップ時に profiles 行を自動作成
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, marketing_opt_in)
  values (new.id, new.email, coalesce((new.raw_user_meta_data->>'marketing_opt_in')::boolean, false));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
