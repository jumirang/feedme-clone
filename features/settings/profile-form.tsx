"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

export function ProfileForm({
  userId,
  initialName,
}: {
  userId: string;
  initialName: string;
}) {
  const [name, setName] = useState(initialName);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    const { data, error } = await createClient()
      .from("profiles")
      .update({ display_name: name })
      .eq("id", userId)
      .select("id");
    setPending(false);

    // RLS가 막으면 오류 없이 0행이 갱신된다.
    if (error || !data?.length) {
      toast.error("저장하지 못했습니다.");
      return;
    }
    toast.success("저장했습니다.");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid gap-2">
        <Label htmlFor="display-name">표시 이름</Label>
        <Input
          id="display-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <Button type="submit" disabled={pending} className="self-start">
        {pending ? "저장 중..." : "저장"}
      </Button>
    </form>
  );
}
