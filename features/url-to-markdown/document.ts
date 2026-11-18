export const LLM_URL_LIMIT = 8000;

export type Page = {
  url: string;
  title: string;
  author: string;
  markdown: string;
};

export type LlmService = "chatgpt" | "claude";

export const LLM_SERVICES: Record<
  LlmService,
  { name: string; base: string }
> = {
  chatgpt: { name: "ChatGPT", base: "https://chatgpt.com/" },
  claude: { name: "Claude", base: "https://claude.ai/new" },
};

export function isHttpUrl(value: string) {
  return /^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(value);
}

export function displayTitle(page: Pick<Page, "url" | "title">) {
  if (page.title) return page.title;
  try {
    return new URL(page.url).hostname;
  } catch {
    return page.url;
  }
}

export function buildDocument(page: Page) {
  const lines = [`# ${page.title || displayTitle(page)}`, "", `> 출처: ${page.url}`];
  if (page.author) lines.push(`> 저자: ${page.author}`);
  return `${lines.join("\n")}\n\n${page.markdown}\n`;
}

export function toFilename(title: string) {
  const safe = title
    .replace(/[\/:*?"<>|]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 80);
  return `${safe || "page"}.md`;
}

export type LlmPlan =
  | { kind: "url"; url: string }
  | { kind: "clipboard"; text: string; url: string };

export function planLlmOpen(
  service: LlmService,
  page: Page,
  prompt: string,
): LlmPlan {
  const { base } = LLM_SERVICES[service];
  const doc = buildDocument(page);
  const text = prompt ? `${prompt}\n\n${doc}` : doc;
  const encoded = encodeURIComponent(text);
  if (encoded.length <= LLM_URL_LIMIT) {
    return { kind: "url", url: `${base}?q=${encoded}` };
  }
  return { kind: "clipboard", text, url: base };
}
