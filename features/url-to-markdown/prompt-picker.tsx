"use client";

import { ChevronRightIcon, PlusIcon } from "lucide-react";
import { useEffect, useRef } from "react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const PRESETS = ["요약해줘", "한국어로 번역해줘", "쉽게 설명해줘"];
const CUSTOM = "__custom";

export type PromptState = {
  open: boolean;
  choice: string; // "" | 프리셋 문구 | CUSTOM
  custom: string;
};

export const EMPTY_PROMPT: PromptState = { open: false, choice: "", custom: "" };

/** 실제로 보낼 프롬프트 문구. 비어 있는 직접 입력은 프롬프트 없음으로 본다. */
export function promptText({ choice, custom }: PromptState) {
  return choice === CUSTOM ? custom.trim() : choice;
}

export function PromptPicker({
  value,
  onChange,
}: {
  value: PromptState;
  onChange: (next: PromptState) => void;
}) {
  const customRef = useRef<HTMLInputElement>(null);
  const text = promptText(value);
  const isCustom = value.choice === CUSTOM;

  useEffect(() => {
    if (isCustom) customRef.current?.focus();
  }, [isCustom]);

  return (
    <Collapsible
      open={value.open}
      onOpenChange={(open) => onChange({ ...value, open })}
    >
      <CollapsibleTrigger className="group -ml-1.5 inline-flex h-7 max-w-full items-center gap-1.5 rounded-md px-1.5 text-[13px] text-muted-foreground outline-none hover:bg-accent hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50">
        <PlusIcon className="size-3.5 shrink-0" />
        <span className="min-w-0 truncate">
          {text ? (
            <>
              프롬프트:{" "}
              <span className="font-medium text-foreground">
                {text.length > 24 ? `${text.slice(0, 24)}…` : text}
              </span>
            </>
          ) : (
            "프롬프트 추가하기"
          )}
        </span>
        <ChevronRightIcon className="size-3.5 shrink-0 transition-transform group-data-[panel-open]:rotate-90" />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <ToggleGroup
          aria-label="프롬프트"
          variant="outline"
          spacing={1.5}
          className="mt-2.5 flex-wrap"
          value={value.choice ? [value.choice] : []}
          onValueChange={(v) =>
            onChange({ ...value, choice: v[0] ?? "", custom: "" })
          }
        >
          {PRESETS.map((p) => (
            <ToggleGroupItem key={p} value={p} className="rounded-full px-3">
              {p}
            </ToggleGroupItem>
          ))}
          <ToggleGroupItem value={CUSTOM} className="rounded-full px-3">
            직접 입력
          </ToggleGroupItem>
        </ToggleGroup>
        {isCustom && (
          <Input
            ref={customRef}
            className="mt-2"
            placeholder="예: 핵심 주장 3가지와 반론을 정리해줘"
            aria-label="직접 입력한 프롬프트"
            value={value.custom}
            onChange={(e) => onChange({ ...value, custom: e.target.value })}
          />
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}
