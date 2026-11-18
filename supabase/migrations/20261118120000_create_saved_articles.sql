-- 사용자가 저장한 변환 결과. 사용자당 같은 원본 URL은 한 행이며, 본인만 읽고 쓸 수 있다.
create table public.saved_articles (
  id uuid not null default gen_random_uuid() primary key,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  url text not null,
  title text not null default '',
  author text not null default '',
  markdown text not null,
  saved_at timestamptz not null default now(),
  unique (user_id, url)
);

create index saved_articles_user_saved_at_idx
  on public.saved_articles (user_id, saved_at desc);

alter table public.saved_articles enable row level security;

grant select, insert, update on public.saved_articles to authenticated;

create policy "saved articles are readable by owner"
  on public.saved_articles for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "saved articles are insertable by owner"
  on public.saved_articles for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "saved articles are updatable by owner"
  on public.saved_articles for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
