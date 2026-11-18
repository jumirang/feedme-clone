import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { buttonVariants } from "@/components/ui/button";
import { getSavedArticle } from "@/features/saved-articles/queries.server";
import { ArticleView } from "@/features/url-to-markdown/article-view";
import { createClient } from "@/lib/supabase/server";

export default async function SavedArticlePage({
  params,
}: PageProps<"/saved/[id]">) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getClaims();
  if (!auth?.claims) redirect(`/auth/login?next=/saved/${id}`);

  const article = await getSavedArticle(id);
  if (!article) notFound();

  return (
    <main className="mx-auto w-full max-w-[680px] px-4 pt-4 pb-12">
      <Link
        href="/saved"
        className={buttonVariants({ variant: "ghost", className: "mb-4 -ml-2" })}
      >
        <ArrowLeftIcon />
        목록으로
      </Link>
      <ArticleView page={article} showSource />
    </main>
  );
}
