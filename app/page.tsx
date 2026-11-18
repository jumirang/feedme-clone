"use client";

import { SaveButton } from "@/features/saved-articles/save-button";
import { Converter } from "@/features/url-to-markdown/converter";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-[680px] px-4 pt-8 pb-12">
      <header>
        <h1 className="text-4xl leading-tight font-extrabold tracking-tight sm:text-5xl">
          FEED-ME
        </h1>
        <p className="mt-2.5 text-[15px] text-muted-foreground">
          어떤 URL이든, Markdown으로.
        </p>
      </header>
      <Converter renderActions={(page) => <SaveButton page={page} />} />
    </main>
  );
}
