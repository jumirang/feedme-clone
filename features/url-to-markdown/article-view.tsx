"use client";

import { useState, type ReactNode } from "react";

import { Separator } from "@/components/ui/separator";

import { displayTitle, type Page } from "./document";
import { ExportActions } from "./export-actions";
import { MarkdownView } from "./markdown-view";
import {
  EMPTY_PROMPT,
  PromptPicker,
  promptText,
  type PromptState,
} from "./prompt-picker";

// 변환 결과 한 편을 제목, 내보내기 액션, 본문으로 보여준다.
// actions는 내보내기 버튼 앞에 놓일 추가 액션이다.
export function ArticleView({
  page,
  actions,
  showSource = false,
}: {
  page: Page;
  actions?: ReactNode;
  showSource?: boolean;
}) {
  const [prompt, setPrompt] = useState<PromptState>(EMPTY_PROMPT);

  return (
    <article>
      <header className="flex flex-col gap-1">
        <h2 className="text-[21px] leading-snug font-bold tracking-tight break-keep [overflow-wrap:anywhere] sm:text-[26px]">
          {displayTitle(page)}
        </h2>
        {page.author && (
          <p className="text-sm text-muted-foreground">By {page.author}</p>
        )}
        {showSource && (
          <a
            href={page.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm break-all text-muted-foreground underline underline-offset-4"
          >
            {page.url}
          </a>
        )}
        <div className="mt-1 flex flex-col gap-1">
          <div className="flex justify-end gap-2">
            {actions}
            <ExportActions page={page} prompt={promptText(prompt)} />
          </div>
          <PromptPicker value={prompt} onChange={setPrompt} />
        </div>
      </header>
      <Separator className="my-8" />
      <MarkdownView markdown={page.markdown} />
    </article>
  );
}
