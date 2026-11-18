import { expect, test } from "vitest";

import { safeNextPath } from "./safe-next-path";

const origin = "http://localhost:3000";

test("같은 사이트의 경로만 통과시키고 나머지는 기본값으로 돌린다", () => {
  expect(safeNextPath("/settings", "/", origin)).toBe("/settings");
  expect(safeNextPath("//evil.com", "/", origin)).toBe("/");
  expect(safeNextPath("https://evil.com", "/", origin)).toBe("/");
  expect(safeNextPath(null, "/settings", origin)).toBe("/settings");
});
