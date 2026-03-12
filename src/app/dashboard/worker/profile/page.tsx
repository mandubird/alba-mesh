import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function WorkerProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profileUser } = await supabase
    .from("users")
    .select("id, name")
    .eq("auth_user_id", user.id)
    .single();

  const { data: workerProfile } = await supabase
    .from("worker_profiles")
    .select("*")
    .eq("user_id", profileUser?.id)
    .single();

  const { data: ownerProfile } = profileUser
    ? await supabase.from("owner_profiles").select("*").eq("user_id", profileUser.id).single()
    : { data: null };

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="text-2xl font-bold text-stone-900">내 프로필</h1>

      <section className="rounded-xl border border-stone-200 bg-white p-6">
        <p className="font-medium">{profileUser?.name ?? "이름 없음"}</p>
        <p className="text-sm text-stone-600">
          출근률 {workerProfile?.attendance_score ?? 100}% · 최근 근무 -회 · 재호출 {workerProfile?.rehire_count ?? 0}회
        </p>
        {workerProfile?.is_owner_worker && ownerProfile && (
          <div className="mt-2 rounded bg-teal-50 p-2 text-sm text-teal-800">
            사장님 대타 · 현재 운영 업종: {ownerProfile.business_type || "-"} · 운영 연차: {ownerProfile.operating_years ?? 0}년
          </div>
        )}
      </section>

      <section className="rounded-xl border border-stone-200 bg-white p-6">
        <h2 className="font-semibold text-stone-900">기본 정보</h2>
        <ul className="mt-2 space-y-1 text-sm text-stone-600">
          <li>카페 경력 {workerProfile?.years_of_experience ?? 0}년</li>
          <li>가능 태그: {(workerProfile?.experience_tags || []).join(", ") || "-"}</li>
          <li>반경: {workerProfile?.radius_km ?? 3}km</li>
          <li>지금 출발 가능: {workerProfile?.can_start_immediately ? "ON" : "OFF"}</li>
        </ul>
      </section>

      <Link
        href="/dashboard/worker/profile/edit"
        className="block rounded-lg border border-stone-300 px-4 py-2 text-center font-medium hover:bg-stone-50"
      >
        프로필 수정
      </Link>
    </div>
  );
}
