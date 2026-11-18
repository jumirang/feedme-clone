"use server";

import type { Page } from "@/features/url-to-markdown/document";
import { createClient } from "@/lib/supabase/server";

export type SaveResult =
  | { ok: true }
  | { ok: false; reason: "unauthenticated" | "failed" };

// 변환 결과를 현재 사용자의 저장한 글로 남긴다. 같은 URL은 최신 결과로 덮어쓴다.
export async function saveArticle(page: Page): Promise<SaveResult> {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getClaims();
  const userId = auth?.claims?.sub;
  if (!userId) return { ok: false, reason: "unauthenticated" };

  const { error } = await supabase.from("saved_articles").upsert(
    {
      user_id: userId,
      url: page.url,
      title: page.title,
      author: page.author,
      markdown: page.markdown,
      saved_at: new Date().toISOString(),
    },
    { onConflict: "user_id,url" },
  );
  return error ? { ok: false, reason: "failed" } : { ok: true };
}
