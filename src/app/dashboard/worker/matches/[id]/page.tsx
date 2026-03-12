import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { CheckinButton } from "./CheckinButton";

export default async function MatchDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profileUser } = await supabase
    .from("users")
    .select("id")
    .eq("auth_user_id", user.id)
    .single();

  const { data: match } = await supabase
    .from("shift_matches")
    .select(
      "id, match_status, confirmed_at, checked_in_at, shift_requests(shift_date, start_time, end_time, memo, stores(store_name, address, phone))"
    )
    .eq("id", id)
    .eq("worker_user_id", profileUser?.id)
    .single();

  if (!match) notFound();

  const sr = match.shift_requests;
  const shift = Array.isArray(sr) ? sr[0] : sr;
  const store = Array.isArray(shift?.stores) ? shift?.stores[0] : shift?.stores;

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <Link href="/dashboard/worker" className="text-sm text-primary hover:underline">
        ← 내 공고
      </Link>

      <div className="rounded-xl border border-stone-200 bg-white p-6">
        <h1 className="text-xl font-bold text-stone-900">
          {shift && format(new Date(shift.shift_date), "M/d (EEE)", { locale: ko })} {shift?.start_time?.slice(0, 5)}~{shift?.end_time?.slice(0, 5)} · {store?.store_name}
        </h1>
        <p className="mt-2 text-stone-600">
          상태:{" "}
          <span
            className={
              match.match_status === "checked_in" || match.match_status === "completed"
                ? "text-green-600"
                : "text-amber-600"
            }
          >
            {match.match_status === "confirmed" && "확정됨"}
            {match.match_status === "checked_in" && "출근 체크인 완료"}
            {match.match_status === "completed" && "완료"}
            {match.match_status === "cancelled" && "취소됨"}
            {match.match_status === "no_show" && "무단 불참"}
          </span>
        </p>
      </div>

      <section className="rounded-xl border border-stone-200 bg-white p-6">
        <h2 className="font-semibold text-stone-900">근무 안내</h2>
        <p className="mt-2 text-stone-600">주소: {store?.address}</p>
        {store?.phone && <p className="text-stone-600">연락처: {store.phone}</p>}
        {shift?.memo && <p className="mt-2 text-stone-600">메모: {shift.memo}</p>}
      </section>

      {match.match_status === "confirmed" && (
        <CheckinButton matchId={id} />
      )}

      {match.match_status === "checked_in" || match.match_status === "completed" ? (
        <p className="text-center text-sm text-stone-500">
          체크인 완료: {match.checked_in_at && format(new Date(match.checked_in_at), "PPp", { locale: ko })}
        </p>
      ) : null}
    </div>
  );
}
