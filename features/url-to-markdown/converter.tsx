"use client";

import {
  ArrowRightIcon,
  CircleAlertIcon,
  Loader2Icon,
  XIcon,
} from "lucide-react";
import { useRef, useState, type ReactNode } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

import { ArticleView } from "./article-view";
import { isHttpUrl, type Page } from "./document";

type View =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "error"; title: string; description: string }
  | { kind: "result"; page: Page };

// renderActions는 변환 결과의 내보내기 버튼 앞에 놓일 액션을 만든다.
export function Converter({
  renderActions,
}: {
  renderActions?: (page: Page) => ReactNode;
}) {
  const [url, setUrl] = useState("");
  const [invalid, setInvalid] = useState(false);
  const [view, setView] = useState<View>({ kind: "idle" });
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const loading = view.kind === "loading";

  function reset() {
    abortRef.current?.abort();
    setUrl("");
    setInvalid(false);
    setView({ kind: "idle" });
    inputRef.current?.focus();
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    const value = url.trim();
    if (!isHttpUrl(value)) {
      setInvalid(true);
      return;
    }
    setView({ kind: "loading" });
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const res = await fetch("/api/convert", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url: value }),
        signal: controller.signal,
      });
      const data = await res.json();
      setView(
        data.ok
          ? { kind: "result", page: data.page }
          : { kind: "error", ...data.error },
      );
    } catch {
      if (controller.signal.aborted) return;
      setView({
        kind: "error",
        title: "변환하지 못했습니다",
        description: "서버에 연결하지 못했습니다. 잠시 뒤 다시 시도해 주세요.",
      });
    }
  }

  return (
    <>
      <form onSubmit={submit} noValidate className="mt-8">
        <InputGroup className="h-12" data-invalid={invalid || undefined}>
          <InputGroupInput
            ref={inputRef}
            type="url"
            inputMode="url"
            autoComplete="off"
            placeholder="https://..."
            aria-label="변환할 URL"
            aria-invalid={invalid || undefined}
            aria-describedby="url-error"
            readOnly={loading}
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setInvalid(false);
            }}
          />
          <InputGroupAddon align="inline-end">
            {url && (
              <InputGroupButton
                size="icon-sm"
                aria-label="지우기"
                onClick={reset}
              >
                <XIcon />
              </InputGroupButton>
            )}
            <Separator orientation="vertical" className="h-5" />
            <InputGroupButton
              type="submit"
              variant="default"
              size="icon-sm"
              aria-label={loading ? "변환 중" : "변환"}
              disabled={loading}
            >
              {loading ? (
                <Loader2Icon className="animate-spin" />
              ) : (
                <ArrowRightIcon />
              )}
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        {invalid && (
          <p id="url-error" className="mt-2 text-[13px] text-destructive">
            http:// 또는 https://로 시작하는 웹 페이지 주소를 입력해 주세요.
          </p>
        )}
      </form>

      <Separator className="my-8" />

      {view.kind === "idle" && (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>변환한 페이지가 여기에 나타납니다</EmptyTitle>
            <EmptyDescription>
              블로그 글, 문서, 뉴스 기사 주소를 붙여넣어 보세요.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}

      {loading && (
        <div className="flex flex-col gap-3" aria-busy="true">
          <Skeleton className="h-[30px] w-4/5" />
          <Skeleton className="h-4 w-[22%]" />
          <div className="h-6" />
          <Skeleton className="h-3.5" />
          <Skeleton className="h-3.5 w-11/12" />
          <Skeleton className="h-3.5 w-5/6" />
        </div>
      )}

      {view.kind === "error" && (
        <Alert variant="destructive">
          <CircleAlertIcon />
          <AlertTitle>{view.title}</AlertTitle>
          <AlertDescription>{view.description}</AlertDescription>
        </Alert>
      )}

      {view.kind === "result" && (
        <ArticleView page={view.page} actions={renderActions?.(view.page)} />
      )}
    </>
  );
}
