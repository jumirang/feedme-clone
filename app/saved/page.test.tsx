import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";

import SavedPage from "@/app/saved/page";
import { listSavedArticles } from "@/features/saved-articles/queries.server";

vi.mock("@/features/saved-articles/queries.server", () => ({
  listSavedArticles: vi.fn(),
}));
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));

test("저장한 글이 없으면 빈 상태와 변환 화면 링크를 보여준다", async () => {
  vi.mocked(listSavedArticles).mockResolvedValue([]);
  render(await SavedPage());

  expect(screen.getByText("아직 저장한 글이 없습니다")).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: "URL 변환하러 가기" }),
  ).toHaveAttribute("href", "/");
});

test("각 항목은 제목, 원본 호스트, 저장 일시를 보여주고 상세로 연결된다", async () => {
  vi.mocked(listSavedArticles).mockResolvedValue([
    {
      id: "a1",
      url: "https://blog.example.com/post",
      title: "",
      savedAt: "2026-11-18T08:20:00Z",
    },
  ]);
  render(await SavedPage());

  const link = screen.getByRole("link", { name: /blog\.example\.com/ });
  expect(link).toHaveAttribute("href", "/saved/a1");
  expect(link).toHaveTextContent("blog.example.com · 2026. 11. 18. 오후 5:20");
  expect(link.querySelector("span")).toHaveTextContent("blog.example.com");
});
