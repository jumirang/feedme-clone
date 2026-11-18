import { Converter } from "@/features/url-to-markdown/converter";
import { ThemeToggle } from "@/features/url-to-markdown/theme-toggle";

export default function Home() {
  return (
    <main className="relative mx-auto w-full max-w-[680px] px-4 pt-14 pb-12">
      <ThemeToggle />
      <header>
        <h1 className="text-4xl leading-tight font-extrabold tracking-tight sm:text-5xl">
          FEED-ME
        </h1>
        <p className="mt-2.5 text-[15px] text-muted-foreground">
          어떤 URL이든, Markdown으로.
        </p>
      </header>
      <Converter />
    </main>
  );
}
