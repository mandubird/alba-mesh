import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

export default async function OwnerShiftDetailPage({
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

  const { data: shift } = await supabase
    .from("shift_requests")
    .select(
      "id, shift_date, start_time, end_time, hourly_wage, status, memo, stores(store_name, address), shift_matches(worker_user_id, match_status, users(name))"
    )
    .eq("id", id)
    .eq("owner_user_id", profileUser?.id)
    .single();

  if (!shift) notFound();

  const match = Array.isArray(shift.shift_matches) ? shift.shift_matches[0] : shift.shift_matches;
  const store = Array.isArray(shift.stores) ? shift.stores[0] : shift.stores;

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <Link href="/dashboard/owner" className="text-sm text-primary hover:underline">
        ← 대시보드
      </Link>

      <div className="rounded-xl border border-stone-200 bg-white p-6">
        <h1 className="text-xl font-bold text-stone-900">
          {format(new Date(shift.shift_date), "M/d (EEE)", { locale: ko })} {shift.start_time?.slice(0, 5)}~{shift.end_time?.slice(0, 5)} · {store?.store_name}
        </h1>
        <p className="mt-2 text-stone-600">시급 {shift.hourly_wage?.toLocaleString()}원</p>
        <p className="text-stone-600">상태: {shift.status === "matched" ? "매칭 완료" : shift.status}</p>
        {match && (
          <p className="mt-2 text-sm text-stone-600">
            확정 근무자: {((): string => {
              const m = match as { users?: { name: string } | { name: string }[]; match_status: string };
              const u = Array.isArray(m.users) ? m.users[0] : m.users;
              return u?.name ?? "-";
            })()} · {(match as { match_status: string }).match_status}
          </p>
        )}
        {shift.memo && <p className="mt-2 text-sm text-stone-500">메모: {shift.memo}</p>}
      </div>

      {shift.status === "open" && (
        <Link
          href={`/dashboard/owner/shifts/${id}/applicants`}
          className="block rounded-lg bg-primary px-4 py-3 text-center font-medium text-white hover:bg-primary-dark"
        >
          지원자 보기
        </Link>
      )}
    </div>
  );
}
