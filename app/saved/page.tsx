import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { buttonVariants } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { listSavedArticles } from "@/features/saved-articles/queries.server";
import { displayTitle } from "@/features/url-to-markdown/document";

const dateFormat = new Intl.DateTimeFormat("ko-KR", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Seoul",
});

function hostOf(url: string) {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

export default async function SavedPage() {
  const articles = await listSavedArticles();
  if (!articles) redirect("/auth/login?next=/saved");

  return (
    <main className="mx-auto w-full max-w-[680px] px-4 pt-8 pb-12">
      <h1 className="text-2xl font-bold tracking-tight">저장한 글</h1>
      {articles.length === 0 ? (
        <Empty className="mt-8">
          <EmptyHeader>
            <EmptyTitle>아직 저장한 글이 없습니다</EmptyTitle>
            <EmptyDescription>
              URL을 변환한 뒤 저장을 누르면 여기에 모입니다.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Link href="/" className={buttonVariants()}>
              URL 변환하러 가기
            </Link>
          </EmptyContent>
        </Empty>
      ) : (
        <ul className="mt-6 flex flex-col divide-y">
          {articles.map((article) => (
            <li key={article.id}>
              <Link
                href={`/saved/${article.id}`}
                className="flex items-center gap-3 rounded-md px-2 py-4 hover:bg-muted"
              >
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="font-medium break-keep [overflow-wrap:anywhere]">
                    {displayTitle(article)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {hostOf(article.url)} · {dateFormat.format(new Date(article.savedAt))}
                  </span>
                </div>
                <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
