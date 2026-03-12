"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function ConfirmButton({
  shiftRequestId,
  applicationId,
  workerUserId,
}: {
  shiftRequestId: string;
  applicationId: string;
  workerUserId: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  async function handleConfirm() {
    if (!confirm("이 지원자를 확정할까요? 확정 시 다른 지원자는 자동으로 거절됩니다.")) return;
    setLoading(true);
    try {
      const { error: matchError } = await supabase.from("shift_matches").insert({
        shift_request_id: shiftRequestId,
        worker_user_id: workerUserId,
        application_id: applicationId,
        match_status: "confirmed",
      });
      if (matchError) throw matchError;
      await supabase
        .from("shift_applications")
        .update({ status: "rejected" })
        .eq("shift_request_id", shiftRequestId)
        .neq("id", applicationId);
      await supabase
        .from("shift_applications")
        .update({ status: "accepted" })
        .eq("id", applicationId);
      await supabase
        .from("shift_requests")
        .update({ status: "matched" })
        .eq("id", shiftRequestId);
      router.refresh();
      router.push("/dashboard/owner");
    } catch (e) {
      console.error(e);
      alert("확정 처리 중 오류가 났습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleConfirm}
      disabled={loading}
      className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-50"
    >
      {loading ? "처리 중..." : "바로 확정"}
    </button>
  );
}
