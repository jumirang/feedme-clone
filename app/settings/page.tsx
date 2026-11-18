import { redirect } from "next/navigation";

import { LogoutButton } from "@/features/auth/logout-button";
import { ProfileForm } from "@/features/settings/profile-form";
import { createClient } from "@/lib/supabase/server";

export default async function SettingsPage() {
  const supabase = await createClient();

  // 서버에서 검증된 claims로만 인증을 판단한다.
  const { data: auth } = await supabase.auth.getClaims();
  const claims = auth?.claims;
  if (!claims) redirect("/auth/login?next=/settings");

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", claims.sub)
    .single();

  return (
    <main className="mx-auto w-full max-w-[680px] px-4 pt-14 pb-12">
      <h1 className="text-2xl font-bold tracking-tight">설정</h1>
      <p className="mt-2 text-sm text-muted-foreground">{claims.email}</p>
      <section className="mt-8">
        <ProfileForm
          userId={claims.sub}
          initialName={profile?.display_name ?? ""}
        />
      </section>
      <div className="mt-10">
        <LogoutButton />
      </div>
    </main>
  );
}
