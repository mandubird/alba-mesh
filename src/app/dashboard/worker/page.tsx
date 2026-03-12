import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { ApplyButton } from "./ApplyButton";

export default async function WorkerFeedPage() {
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

  const { data: shifts } = await supabase
    .from("shift_requests")
    .select(
      "id, shift_date, start_time, end_time, hourly_wage, urgency_level, task_tags, allow_beginner, stores(store_name, address)"
    )
    .eq("status", "open")
    .gte("shift_date", new Date().toISOString().slice(0, 10))
    .order("urgency_level", { ascending: false })
    .order("shift_date")
    .limit(30);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">긴급 공고</h1>
        <p className="mt-1 text-stone-600">지금 출발 가능 · 오늘/내일 공고를 확인하세요.</p>
      </div>

      <div className="flex gap-2 text-sm">
        <span className="rounded bg-amber-100 px-2 py-1">긴급순</span>
        <span className="rounded bg-stone-100 px-2 py-1 text-stone-500">가까운 순</span>
        <span className="rounded bg-stone-100 px-2 py-1 text-stone-500">최신순</span>
      </div>

      <ul className="space-y-4">
        {(!shifts || shifts.length === 0) ? (
          <li className="rounded-xl border border-stone-200 bg-white p-8 text-center text-stone-500">
            현재 열린 긴급 공고가 없습니다.
          </li>
        ) : (
          shifts.map((s: { id: string; shift_date: string; start_time: string; end_time: string; hourly_wage: number; urgency_level: string; task_tags: string[]; allow_beginner: boolean; stores: { store_name: string; address: string } | { store_name: string; address: string }[] | null }) => {
            const store = Array.isArray(s.stores) ? s.stores[0] : s.stores;
            return (
            <li
              key={s.id}
              className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  {s.urgency_level !== "normal" && (
                    <span className="inline-block rounded bg-urgent/10 px-2 py-0.5 text-xs font-medium text-urgent">
                      긴급
                    </span>
                  )}
                  <p className="mt-1 font-medium">
                    {format(new Date(s.shift_date), "M/d (EEE)", { locale: ko })} {s.start_time?.slice(0, 5)}~{s.end_time?.slice(0, 5)}
                  </p>
                  <p className="text-stone-600">{store?.store_name} · {store?.address}</p>
                  <p className="text-primary font-semibold">시급 {s.hourly_wage.toLocaleString()}원</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {(s.task_tags || []).slice(0, 4).map((t) => (
                      <span key={t} className="rounded bg-stone-100 px-2 py-0.5 text-xs">
                        {t}
                      </span>
                    ))}
                    {s.allow_beginner && (
                      <span className="rounded bg-green-100 px-2 py-0.5 text-xs text-green-800">
                        초보 가능
                      </span>
                    )}
                  </div>
                </div>
                <ApplyButton shiftRequestId={s.id} workerUserId={profileUser?.id} />
              </div>
            </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
