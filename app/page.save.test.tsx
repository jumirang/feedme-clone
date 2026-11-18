import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, expect, test, vi } from "vitest";

import Home from "@/app/page";
import { saveArticle } from "@/features/saved-articles/actions";

const push = vi.fn();
const toast = vi.hoisted(() => ({ success: vi.fn(), error: vi.fn() }));

vi.mock("next-themes", () => ({ useTheme: () => ({ setTheme: vi.fn() }) }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));
vi.mock("sonner", () => ({ toast }));
vi.mock("@/features/saved-articles/actions", () => ({
  saveArticle: vi.fn(),
}));

const page = {
  url: "https://example.com/post",
  title: "예시 글",
  author: "홍길동",
  markdown: "본문입니다.",
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => Response.json({ ok: true, page })),
  );
});

async function convert() {
  render(<Home />);
  fireEvent.change(screen.getByLabelText("변환할 URL"), {
    target: { value: page.url },
  });
  await act(async () => {
    fireEvent.click(screen.getByRole("button", { name: "변환" }));
  });
  await screen.findByRole("heading", { level: 2, name: "예시 글" });
}

test("변환 결과의 복사하기 옆에 저장 버튼이 보인다", async () => {
  await convert();

  const save = screen.getByRole("button", { name: "저장" });
  const copy = screen.getByRole("button", { name: "복사하기" });
  expect(save.parentElement).toBe(copy.parentElement?.parentElement);
});

test("저장하면 변환 결과를 저장하고 성공을 알린다", async () => {
  vi.mocked(saveArticle).mockResolvedValue({ ok: true });
  await convert();

  await act(async () => {
    fireEvent.click(screen.getByRole("button", { name: "저장" }));
  });

  expect(saveArticle).toHaveBeenCalledWith(page);
  expect(toast.success).toHaveBeenCalledWith(
    "저장했습니다",
    expect.anything(),
  );
});

test("로그인하지 않았으면 저장 대신 로그인 화면으로 보낸다", async () => {
  vi.mocked(saveArticle).mockResolvedValue({
    ok: false,
    reason: "unauthenticated",
  });
  await convert();

  await act(async () => {
    fireEvent.click(screen.getByRole("button", { name: "저장" }));
  });

  expect(push).toHaveBeenCalledWith("/auth/login?next=/saved");
});

test("저장에 실패하면 오류를 알리고 변환 결과는 남는다", async () => {
  vi.mocked(saveArticle).mockResolvedValue({ ok: false, reason: "failed" });
  await convert();

  await act(async () => {
    fireEvent.click(screen.getByRole("button", { name: "저장" }));
  });

  expect(toast.error).toHaveBeenCalled();
  expect(
    screen.getByRole("heading", { level: 2, name: "예시 글" }),
  ).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "저장" })).toBeEnabled();
});
