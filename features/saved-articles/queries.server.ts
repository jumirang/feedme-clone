import type { Page } from "@/features/url-to-markdown/document";
import { createClient } from "@/lib/supabase/server";

export type SavedArticleSummary = {
  id: string;
  url: string;
  title: string;
  savedAt: string;
};

// 현재 사용자의 저장한 글을 최신 저장순으로 가져온다. 로그인하지 않았으면 null이다.
export async function listSavedArticles(): Promise<
  SavedArticleSummary[] | null
> {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getClaims();
  if (!auth?.claims) return null;

  const { data, error } = await supabase
    .from("saved_articles")
    .select("id, url, title, saved_at")
    .order("saved_at", { ascending: false });
  if (error) throw error;
  return data.map((row) => ({
    id: row.id,
    url: row.url,
    title: row.title,
    savedAt: row.saved_at,
  }));
}

// 저장한 글 한 편을 가져온다. 다른 사용자의 글이나 없는 글이면 null이다.
export async function getSavedArticle(id: string): Promise<Page | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("saved_articles")
    .select("url, title, author, markdown")
    .eq("id", id)
    .maybeSingle();
  return data;
}
