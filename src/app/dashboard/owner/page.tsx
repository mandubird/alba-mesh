import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

export default async function OwnerDashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const name = user.user_metadata?.name || "사장님";

  // DB에 users 레코드가 있으면 owner_user_id로 조회. MVP에서는 Supabase RPC 또는 서버에서 auth_user_id로 users.id 조회 후 사용.
  // 여기서는 anon key로 public 테이블 조회 가능하다고 가정. RLS 적용 시 본인 데이터만.
  const { data: profileUser } = await supabase
    .from("users")
    .select("id")
    .eq("auth_user_id", user.id)
    .single();

  const ownerId = profileUser?.id;
  let openCount = 0;
  let matchedCount = 0;
  let favoriteCount = 0;
  let shifts: { id: string; shift_date: string; start_time: string; end_time: string; status: string; store_name?: string; application_count?: number }[] = [];

  if (ownerId) {
    const [openRes, matchedRes, favRes, shiftsRes] = await Promise.all([
      supabase.from("shift_requests").select("id", { count: "exact", head: true }).eq("owner_user_id", ownerId).eq("status", "open"),
      supabase.from("shift_requests").select("id", { count: "exact", head: true }).eq("owner_user_id", ownerId).eq("status", "matched"),
      supabase.from("favorite_workers").select("id", { count: "exact", head: true }).eq("owner_user_id", ownerId),
      supabase
        .from("shift_requests")
        .select("id, shift_date, start_time, end_time, status, stores(store_name)")
        .eq("owner_user_id", ownerId)
        .in("status", ["open", "matched"])
        .order("shift_date", { ascending: true })
        .limit(10),
    ]);
    openCount = openRes.count ?? 0;
    matchedCount = matchedRes.count ?? 0;
    favoriteCount = favRes.count ?? 0;
    shifts = (shiftsRes.data || []).map((s: { id: string; shift_date: string; start_time: string; end_time: string; status: string; stores: { store_name: string } | { store_name: string }[] | null }) => {
      const store = Array.isArray(s.stores) ? s.stores[0] : s.stores;
      return {
        id: s.id,
        shift_date: s.shift_date,
        start_time: s.start_time,
        end_time: s.end_time,
        status: s.status,
        store_name: store?.store_name,
      };
    });
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">안녕하세요, {name}님</h1>
        <p className="mt-1 text-stone-600">
          오늘 공백 {openCount}건 | 진행 중 매칭 {matchedCount}건 | 재호출 가능 인력 {favoriteCount}명
        </p>
      </div>

      <div>
        <Link
          href="/dashboard/owner/shifts/new"
          className="inline-flex items-center rounded-lg bg-primary px-4 py-3 font-medium text-white hover:bg-primary-dark"
        >
          + 긴급 공백 등록
        </Link>
      </div>

      <section>
        <h2 className="text-lg font-semibold text-stone-900">현재 진행 중 공백</h2>
        {shifts.length === 0 ? (
          <p className="mt-2 text-stone-500">등록된 공백이 없습니다. 위 버튼으로 공백을 등록해보세요.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {shifts.map((s) => (
              <li
                key={s.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-stone-200 bg-white p-4"
              >
                <div>
                  <p className="font-medium">
                    {format(new Date(s.shift_date), "M/d (EEE)", { locale: ko })} {s.start_time?.slice(0, 5)}~{s.end_time?.slice(0, 5)}
                  </p>
                  <p className="text-sm text-stone-600">{s.store_name || "매장"}</p>
                  <span
                    className={`mt-1 inline-block rounded px-2 py-0.5 text-xs ${
                      s.status === "open" ? "bg-amber-100 text-amber-800" : "bg-green-100 text-green-800"
                    }`}
                  >
                    {s.status === "open" ? "모집 중" : "매칭 완료"}
                  </span>
                </div>
                <Link
                  href={s.status === "open" ? `/dashboard/owner/shifts/${s.id}/applicants` : `/dashboard/owner/shifts/${s.id}`}
                  className="rounded-lg border border-stone-300 px-3 py-2 text-sm font-medium hover:bg-stone-50"
                >
                  {s.status === "open" ? "지원자 보기" : "상세 보기"}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold text-stone-900">재호출</h2>
        <p className="mt-1 text-sm text-stone-600">지난번 만족한 대타를 저장하고 다시 요청할 수 있습니다.</p>
        <Link
          href="/dashboard/owner/favorites"
          className="mt-2 inline-block text-primary hover:underline"
        >
          즐겨찾기 목록 보기 →
        </Link>
      </section>
    </div>
  );
}
