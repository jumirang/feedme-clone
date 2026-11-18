import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";

import { BookmarkIcon } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { ThemeToggle } from "@/features/url-to-markdown/theme-toggle";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FEED-ME",
  description: "어떤 URL이든, Markdown으로.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      suppressHydrationWarning
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}
    >
      <body className="min-h-full flex flex-col"><ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <nav className="mx-auto flex w-full max-w-[680px] items-center justify-between gap-1 px-4 pt-3">
            <Link href="/" className={buttonVariants({ variant: "ghost" })}>
              FEED-ME
            </Link>
            <div className="flex items-center gap-1">
              <Link href="/saved" className={buttonVariants({ variant: "ghost" })}>
                <BookmarkIcon />
                저장한 글
              </Link>
              <ThemeToggle />
            </div>
          </nav>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
