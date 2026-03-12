"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function CheckinButton({ matchId }: { matchId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  async function handleCheckin() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data: profileUser } = await supabase
      .from("users")
      .select("id")
      .eq("auth_user_id", user.id)
      .single();
    if (!profileUser) return;

    setLoading(true);
    try {
      const { error: checkinError } = await supabase.from("checkins").insert({
        shift_match_id: matchId,
        worker_user_id: profileUser.id,
      });
      if (checkinError) throw checkinError;
      await supabase
        .from("shift_matches")
        .update({ match_status: "checked_in", checked_in_at: new Date().toISOString() })
        .eq("id", matchId);
      router.refresh();
    } catch (e) {
      console.error(e);
      alert("체크인 처리 중 오류가 났습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-6">
      <p className="text-sm text-stone-600">근무 시작 후 출근 체크인을 해주세요.</p>
      <button
        type="button"
        onClick={handleCheckin}
        disabled={loading}
        className="mt-4 w-full rounded-lg bg-primary py-3 font-medium text-white hover:bg-primary-dark disabled:opacity-50"
      >
        {loading ? "처리 중..." : "출근 체크인"}
      </button>
    </div>
  );
}
