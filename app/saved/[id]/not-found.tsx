import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";

export default function SavedArticleNotFound() {
  return (
    <main className="mx-auto w-full max-w-[680px] px-4 pt-8 pb-12">
      <Empty>
        <EmptyHeader>
          <EmptyTitle>글을 찾을 수 없습니다</EmptyTitle>
          <EmptyDescription>
            없는 글이거나 내가 저장한 글이 아닙니다.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Link href="/saved" className={buttonVariants()}>
            저장한 글 목록으로
          </Link>
        </EmptyContent>
      </Empty>
    </main>
  );
}
