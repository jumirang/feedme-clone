# profiles 백필 없음

`supabase/migrations/20261118073335_create_profiles.sql`의 트리거는 마이그레이션 이후 가입한 사용자에게만 프로필 행을 만든다. 그 전에 있던 `auth.users`에는 행이 없어 `/settings`에서 표시 이름 저장이 항상 실패한다. 현재 프로젝트에는 검증용 계정만 있어 영향이 없으며, 기존 사용자가 생기면 백필 마이그레이션을 추가한다.
