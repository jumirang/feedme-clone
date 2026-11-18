import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";

import Home from "@/app/page";

vi.mock("next-themes", () => ({ useTheme: () => ({ setTheme: vi.fn() }) }));

test("첫 화면은 서비스 이름, 부제, URL 입력, 빈 결과 안내를 보여준다", () => {
  render(<Home />);

  expect(
    screen.getByRole("heading", { level: 1, name: "FEED-ME" }),
  ).toBeInTheDocument();
  expect(screen.getByText("어떤 URL이든, Markdown으로.")).toBeInTheDocument();
  expect(screen.getByLabelText("변환할 URL")).toBeInTheDocument();
  expect(
    screen.getByText("변환한 페이지가 여기에 나타납니다"),
  ).toBeInTheDocument();
});
