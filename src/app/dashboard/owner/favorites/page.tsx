import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function FavoritesPage() {
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

  const { data: favorites } = await supabase
    .from("favorite_workers")
    .select(
      "id, worker_user_id, created_at, users(name), worker_profiles(years_of_experience, attendance_score, rehire_count, experience_tags)"
    )
    .eq("owner_user_id", profileUser?.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <Link href="/dashboard/owner" className="text-sm text-primary hover:underline">
          ← 대시보드
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-stone-900">지난번 만족한 대타</h1>
        <p className="mt-1 text-stone-600">저장한 근무자에게 다시 요청할 수 있습니다.</p>
      </div>

      {(!favorites || favorites.length === 0) ? (
        <div className="rounded-xl border border-stone-200 bg-white p-8 text-center text-stone-500">
          아직 저장한 근무자가 없습니다. 근무 완료 후 만족한 대타를 즐겨찾기에 추가해보세요.
        </div>
      ) : (
        <ul className="space-y-4">
          {favorites.map((f: { id: string; worker_user_id: string; users: { name: string } | { name: string }[] | null; worker_profiles: { years_of_experience: number; attendance_score: number; rehire_count: number; experience_tags: string[] } | { years_of_experience: number; attendance_score: number; rehire_count: number; experience_tags: string[] }[] | null }) => {
            const u = Array.isArray(f.users) ? f.users[0] : f.users;
            const wp = Array.isArray(f.worker_profiles) ? f.worker_profiles[0] : f.worker_profiles;
            return (
            <li
              key={f.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-stone-200 bg-white p-4"
            >
              <div>
                <p className="font-medium">{u?.name ?? "알 수 없음"}</p>
                <p className="text-sm text-stone-600">
                  경력 {wp?.years_of_experience ?? 0}년 · 출근률 {wp?.attendance_score ?? 100}% · 재호출 {wp?.rehire_count ?? 0}회
                </p>
                <p className="text-xs text-stone-500">
                  {(wp?.experience_tags || []).join(", ")}
                </p>
              </div>
              <Link
                href={`/dashboard/owner/rehire?worker_id=${f.worker_user_id}`}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
              >
                다시 요청
              </Link>
            </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
