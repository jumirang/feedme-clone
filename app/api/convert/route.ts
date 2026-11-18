import { convertUrl } from "@/features/url-to-markdown/convert.server";
import { isHttpUrl } from "@/features/url-to-markdown/document";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    url?: unknown;
  } | null;
  const url = typeof body?.url === "string" ? body.url.trim() : "";
  if (!isHttpUrl(url)) {
    return Response.json(
      {
        ok: false,
        error: {
          title: "주소 형식이 올바르지 않습니다",
          description: "http:// 또는 https://로 시작하는 주소를 입력해 주세요.",
        },
      },
      { status: 400 },
    );
  }
  return Response.json(await convertUrl(url));
}
