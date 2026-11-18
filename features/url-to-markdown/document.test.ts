import { describe, expect, test } from "vitest";

import {
  buildDocument,
  isHttpUrl,
  planLlmOpen,
  toFilename,
  type Page,
} from "./document";

const page: Page = {
  url: "https://example.com/a",
  title: "제목",
  author: "홍길동",
  markdown: "본문",
};

test("http(s) URL만 받는다", () => {
  expect(isHttpUrl("https://a.b")).toBe(true);
  expect(isHttpUrl("ftp://a.b")).toBe(false);
  expect(isHttpUrl("hello")).toBe(false);
});

test("Markdown 문서는 제목, 출처, 저자, 본문 순서이고 저자가 없으면 저자 줄을 뺀다", () => {
  expect(buildDocument(page)).toBe(
    "# 제목\n\n> 출처: https://example.com/a\n> 저자: 홍길동\n\n본문\n",
  );
  expect(buildDocument({ ...page, author: "" })).not.toContain("저자");
});

test("파일명은 안전한 문자만 남기고 비면 page.md", () => {
  expect(toFilename('a/b: "c" d')).toBe("ab-c-d.md");
  expect(toFilename("")).toBe("page.md");
  expect(toFilename("/:*")).toBe("page.md");
});

describe("LLM 열기 계획", () => {
  test("짧으면 프롬프트와 문서를 ?q=에 담는다", () => {
    const plan = planLlmOpen("claude", page, "요약해줘");
    expect(plan.kind).toBe("url");
    const url = new URL(plan.url);
    expect(url.origin + url.pathname).toBe("https://claude.ai/new");
    expect(url.searchParams.get("q")).toBe(`요약해줘\n\n${buildDocument(page)}`);
  });

  test("프롬프트가 없으면 문서만 보낸다", () => {
    const plan = planLlmOpen("chatgpt", page, "");
    expect(new URL(plan.url).searchParams.get("q")).toBe(buildDocument(page));
  });

  test("길면 q 없이 클립보드로 넘긴다", () => {
    const plan = planLlmOpen("chatgpt", { ...page, markdown: "가".repeat(2000) }, "요약해줘");
    expect(plan.kind).toBe("clipboard");
    expect(plan.url).toBe("https://chatgpt.com/");
    if (plan.kind === "clipboard") expect(plan.text.startsWith("요약해줘\n\n# 제목")).toBe(true);
  });
});
