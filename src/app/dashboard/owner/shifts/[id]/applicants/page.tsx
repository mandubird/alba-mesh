import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { ConfirmButton } from "./ConfirmButton";

export default async function ApplicantsPage({
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
    .select("id, shift_date, start_time, end_time, status, stores(store_name)")
    .eq("id", id)
    .eq("owner_user_id", profileUser?.id)
    .single();

  if (!shift || shift.status !== "open") notFound();

  const shiftStores = Array.isArray(shift.stores) ? shift.stores[0] : shift.stores;
  const shiftStoreName = shiftStores?.store_name;

  const { data: applications } = await supabase
    .from("shift_applications")
    .select(
      "id, worker_user_id, applied_at, users(name), worker_profiles(years_of_experience, experience_tags, attendance_score, rehire_count, is_owner_worker)"
    )
    .eq("shift_request_id", id)
    .eq("status", "applied");

  const applicants = (applications || []).map((a: { id: string; worker_user_id: string; users: { name: string } | { name: string }[] | null; worker_profiles: { years_of_experience: number; experience_tags: string[]; attendance_score: number; rehire_count: number; is_owner_worker: boolean } | { years_of_experience: number; experience_tags: string[]; attendance_score: number; rehire_count: number; is_owner_worker: boolean }[] | null }) => {
    const u = Array.isArray(a.users) ? a.users[0] : a.users;
    const wp = Array.isArray(a.worker_profiles) ? a.worker_profiles[0] : a.worker_profiles;
    return { ...a, name: u?.name ?? "알 수 없음", profile: wp };
  });

  return (
    <div className="space-y-6">
      <div>
        <Link href="/dashboard/owner" className="text-sm text-primary hover:underline">
          ← 대시보드
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-stone-900">지원자 {applicants.length}명</h1>
        <p className="text-stone-600">
          {format(new Date(shift.shift_date), "M/d (EEE)", { locale: ko })} {shift.start_time?.slice(0, 5)}~{shift.end_time?.slice(0, 5)} · {shiftStoreName}
        </p>
      </div>

      <div className="flex gap-2 text-sm">
        <span className="rounded bg-stone-200 px-2 py-1">출근률 높은 순</span>
        <span className="rounded bg-stone-100 px-2 py-1 text-stone-500">가까운 순</span>
        <span className="rounded bg-stone-100 px-2 py-1 text-stone-500">재호출 많은 순</span>
      </div>

      <ul className="space-y-4">
        {applicants.length === 0 ? (
          <li className="rounded-xl border border-stone-200 bg-white p-8 text-center text-stone-500">
            아직 지원자가 없습니다.
          </li>
        ) : (
          applicants.map((app: { id: string; worker_user_id: string; name: string; profile: { years_of_experience: number; experience_tags: string[]; attendance_score: number; rehire_count: number; is_owner_worker: boolean } | null }) => (
            <li
              key={app.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-stone-200 bg-white p-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{app.name}</p>
                  {app.profile?.is_owner_worker && (
                    <span className="rounded bg-teal-100 px-2 py-0.5 text-xs text-teal-800">
                      사장님 대타
                    </span>
                  )}
                </div>
                <p className="text-sm text-stone-600">
                  카페 경력 {app.profile?.years_of_experience ?? 0}년 · 출근률 {app.profile?.attendance_score ?? 100}%
                </p>
                <p className="text-xs text-stone-500">
                  태그: {(app.profile?.experience_tags || []).join(", ") || "-"} · 재호출 {app.profile?.rehire_count ?? 0}회
                </p>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/dashboard/owner/workers/${app.worker_user_id}`}
                  className="rounded-lg border border-stone-300 px-3 py-2 text-sm font-medium hover:bg-stone-50"
                >
                  프로필 보기
                </Link>
                <ConfirmButton shiftRequestId={id} applicationId={app.id} workerUserId={app.worker_user_id} />
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
