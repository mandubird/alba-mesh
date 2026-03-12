"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function ApplyButton({
  shiftRequestId,
  workerUserId,
}: {
  shiftRequestId: string;
  workerUserId?: string | null;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  async function handleApply() {
    if (!workerUserId) {
      alert("로그인 후 지원할 수 있습니다.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.from("shift_applications").insert({
        shift_request_id: shiftRequestId,
        worker_user_id: workerUserId,
        status: "applied",
      });
      if (error) {
        if (error.code === "23505") {
          alert("이미 지원한 공고입니다.");
        } else {
          alert(error.message);
        }
        return;
      }
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleApply}
      disabled={loading}
      className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-50"
    >
      {loading ? "지원 중..." : "지원하기"}
    </button>
  );
}
