"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

import { safeNextPath } from "./safe-next-path";

type Mode = "login" | "sign-up";

const COPY = {
  login: {
    title: "로그인",
    description: "이메일과 비밀번호로 로그인합니다.",
    submit: "로그인",
    pending: "로그인 중...",
    switchText: "계정이 없으신가요?",
    switchLabel: "회원가입",
    switchHref: "/auth/sign-up",
  },
  "sign-up": {
    title: "회원가입",
    description: "이메일과 비밀번호로 계정을 만듭니다.",
    submit: "회원가입",
    pending: "계정 만드는 중...",
    switchText: "이미 계정이 있으신가요?",
    switchLabel: "로그인",
    switchHref: "/auth/login",
  },
} as const;

export function AuthForm({ mode }: { mode: Mode }) {
  const copy = COPY[mode];
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setError(null);

    const supabase = createClient();
    const credentials = { email, password };
    const { data, error } =
      mode === "login"
        ? await supabase.auth.signInWithPassword(credentials)
        : await supabase.auth.signUp(credentials);

    if (error) {
      setError(error.message);
      setPending(false);
      return;
    }
    // 이메일 인증을 끈 프로젝트에서는 가입 직후 세션이 만들어진다.
    if (!data.session) {
      setError("세션을 만들지 못했습니다. 이메일 인증 설정을 확인해 주세요.");
      setPending(false);
      return;
    }

    const next = new URLSearchParams(window.location.search).get("next");
    router.push(safeNextPath(next, "/settings"));
    router.refresh();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">{copy.title}</CardTitle>
        <CardDescription>{copy.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid gap-2">
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              type="password"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              minLength={6}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? copy.pending : copy.submit}
          </Button>
          <p className="text-center text-sm">
            {copy.switchText}{" "}
            <Link href={copy.switchHref} className="underline underline-offset-4">
              {copy.switchLabel}
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
