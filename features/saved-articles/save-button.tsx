"use client";

import { BookmarkIcon, Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import type { Page } from "@/features/url-to-markdown/document";

import { saveArticle } from "./actions";

export function SaveButton({ page }: { page: Page }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function save() {
    setPending(true);
    const result = await saveArticle(page).catch(
      () => ({ ok: false, reason: "failed" }) as const,
    );
    setPending(false);

    if (result.ok) {
      toast.success("저장했습니다", {
        action: { label: "목록 보기", onClick: () => router.push("/saved") },
      });
    } else if (result.reason === "unauthenticated") {
      router.push("/auth/login?next=/saved");
    } else {
      toast.error("저장하지 못했습니다", {
        description: "잠시 뒤 다시 시도해 주세요.",
      });
    }
  }

  return (
    <Button variant="outline" onClick={save} disabled={pending}>
      {pending ? <Loader2Icon className="animate-spin" /> : <BookmarkIcon />}
      저장
    </Button>
  );
}
