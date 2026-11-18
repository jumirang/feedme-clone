-- 사용자별 프로필. auth.users 한 명당 한 행이며, 본인만 읽고 수정할 수 있다.
create table public.profiles (
  id uuid not null references auth.users (id) on delete cascade,
  display_name text,
  primary key (id)
);

alter table public.profiles enable row level security;

grant select, update on public.profiles to authenticated;

create policy "profiles are readable by owner"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id);

create policy "profiles are updatable by owner"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- 새 사용자가 만들어질 때 프로필 행을 함께 만든다.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$;

-- security definer 함수는 API로 호출되지 않도록 실행 권한을 모두 회수한다.
revoke execute on function public.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
