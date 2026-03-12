import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

export default async function MyMatchesPage() {
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

  const { data: matches } = await supabase
    .from("shift_matches")
    .select(
      "id, match_status, confirmed_at, shift_requests(shift_date, start_time, end_time, stores(store_name))"
    )
    .eq("worker_user_id", profileUser?.id)
    .order("confirmed_at", { ascending: false })
    .limit(20);

  return (
    <div className="space-y-6">
      <div>
        <Link href="/dashboard/worker" className="text-sm text-primary hover:underline">
          ← 긴급 공고
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-stone-900">내 매칭</h1>
      </div>

      {(!matches || matches.length === 0) ? (
        <div className="rounded-xl border border-stone-200 bg-white p-8 text-center text-stone-500">
          아직 확정된 매칭이 없습니다.
        </div>
      ) : (
        <ul className="space-y-3">
          {matches.map((m: { id: string; match_status: string; shift_requests: unknown }) => {
            const raw = m.shift_requests;
            const sr = Array.isArray(raw) ? raw[0] : raw;
            const s = sr as { shift_date: string; start_time: string; end_time: string; stores: { store_name: string } | { store_name: string }[] | null } | null;
            const store = s && (Array.isArray(s.stores) ? s.stores[0] : s.stores);
            return (
              <li key={m.id} className="rounded-xl border border-stone-200 bg-white p-4">
                <Link href={`/dashboard/worker/matches/${m.id}`} className="block">
                  <p className="font-medium">
                    {s && format(new Date(s.shift_date), "M/d (EEE)", { locale: ko })} {s?.start_time?.slice(0, 5)}~{s?.end_time?.slice(0, 5)} · {store?.store_name}
                  </p>
                  <p className="text-sm text-stone-500">
                    {m.match_status === "confirmed" && "확정됨"}
                    {m.match_status === "checked_in" && "체크인 완료"}
                    {m.match_status === "completed" && "완료"}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
