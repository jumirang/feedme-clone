import { Defuddle } from "defuddle/node";
import { parseHTML } from "linkedom";

import type { Page } from "./document";

export type ConvertError = { title: string; description: string };
export type ConvertResult =
  | { ok: true; page: Page }
  | { ok: false; error: ConvertError };

const FETCH_TIMEOUT_MS = 15_000;

function fail(title: string, description: string): ConvertResult {
  return { ok: false, error: { title, description } };
}

export async function convertUrl(url: string): Promise<ConvertResult> {
  let response: Response;
  try {
    response = await fetch(url, {
      redirect: "follow",
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      headers: {
        "user-agent":
          "Mozilla/5.0 (compatible; FeedMe/1.0; +https://example.com/feed-me)",
        accept: "text/html,application/xhtml+xml",
      },
    });
  } catch (e) {
    const timedOut = e instanceof Error && e.name === "TimeoutError";
    return fail(
      "페이지를 가져오지 못했습니다",
      timedOut
        ? "응답이 15초 안에 오지 않았습니다. 잠시 뒤 다시 시도해 주세요."
        : `${url.replace(/^https?:\/\//, "")} 에 연결하지 못했습니다. 주소가 맞는지 확인한 뒤 다시 시도해 주세요.`,
    );
  }

  if (!response.ok) {
    return fail(
      "페이지를 가져오지 못했습니다",
      `서버가 ${response.status} 응답을 돌려줬습니다. 주소가 맞는지 확인한 뒤 다시 시도해 주세요.`,
    );
  }

  const type = response.headers.get("content-type") ?? "";
  if (!/html|xhtml/i.test(type)) {
    return fail(
      "HTML 페이지가 아닙니다",
      `이 주소는 ${type.split(";")[0] || "알 수 없는 형식"} 파일을 돌려줍니다. 웹 페이지(HTML) 주소만 변환할 수 있습니다.`,
    );
  }

  const html = await response.text();
  const { document } = parseHTML(html);
  const result = await Defuddle(document, response.url || url, {
    markdown: true,
  });
  const markdown = (result.content ?? "").trim();
  if (!markdown) {
    return fail(
      "본문을 찾지 못했습니다",
      "페이지에서 추출할 본문이 없습니다. JavaScript로 내용을 그리는 페이지라면 변환되지 않을 수 있습니다.",
    );
  }

  return {
    ok: true,
    page: {
      url,
      title: (result.title ?? "").trim(),
      author: (result.author ?? "").trim(),
      markdown,
    },
  };
}
