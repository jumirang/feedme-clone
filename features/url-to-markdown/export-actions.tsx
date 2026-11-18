"use client";

import {
  CheckIcon,
  ChevronDownIcon,
  CopyIcon,
  DownloadIcon,
  MessageSquareIcon,
  SparklesIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  LLM_SERVICES,
  buildDocument,
  planLlmOpen,
  toFilename,
  type LlmService,
  type Page,
} from "./document";

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function ExportActions({
  page,
  prompt,
}: {
  page: Page;
  prompt: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    if (await copyText(buildDocument(page))) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } else {
      toast.error("복사하지 못했습니다", {
        description: "브라우저가 클립보드 접근을 막았습니다.",
      });
    }
  }

  function download() {
    const name = toFilename(page.title);
    const a = document.createElement("a");
    a.href = URL.createObjectURL(
      new Blob([buildDocument(page)], { type: "text/markdown" }),
    );
    a.download = name;
    a.click();
    URL.revokeObjectURL(a.href);
    toast.success(`${name} 파일을 내려받았습니다`);
  }

  async function openLlm(service: LlmService) {
    const { name } = LLM_SERVICES[service];
    const plan = planLlmOpen(service, page, prompt);
    if (plan.kind === "url") {
      window.open(plan.url, "_blank", "noopener");
      return;
    }
    if (await copyText(plan.text)) {
      window.open(plan.url, "_blank", "noopener");
      toast.info("본문이 길어 클립보드에 복사했습니다", {
        description: `새 탭의 ${name} 입력란에 붙여넣기(Ctrl+V / ⌘V) 하세요.`,
        duration: 6000,
      });
    } else {
      toast.error("복사하지 못해 열지 않았습니다", {
        description:
          "브라우저가 클립보드 접근을 막았습니다. 복사하기로 직접 복사해 주세요.",
      });
    }
  }

  return (
    <ButtonGroup>
      <Button variant="outline" onClick={copy}>
        {copied ? <CheckIcon /> : <CopyIcon />}
        {copied ? "복사했습니다" : "복사하기"}
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="outline" size="icon" aria-label="더 보기">
              <ChevronDownIcon />
            </Button>
          }
        />
        <DropdownMenuContent align="end" className="min-w-48">
          <DropdownMenuItem onClick={download}>
            <DownloadIcon />
            마크다운 다운로드
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => openLlm("chatgpt")}>
            <SparklesIcon />
            ChatGPT에서 열기
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => openLlm("claude")}>
            <MessageSquareIcon />
            Claude에서 열기
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  );
}
