"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { setTheme } = useTheme();
  // 테마는 <html class="dark">로 정해지므로 아이콘은 CSS로 전환해 깜빡임을 피한다.
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="테마 전환"
      title="테마 전환"
      onClick={() =>
        setTheme(
          document.documentElement.classList.contains("dark")
            ? "light"
            : "dark",
        )
      }
    >
      <MoonIcon className="dark:hidden" />
      <SunIcon className="hidden dark:block" />
    </Button>
  );
}
