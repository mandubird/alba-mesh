import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profileUser } = await supabase
    .from("users")
    .select("role")
    .eq("auth_user_id", user.id)
    .single();

  if (profileUser?.role !== "admin") {
    redirect("/dashboard");
  }

  const [
    { count: shiftCount },
    { count: matchCount },
    { count: reportCount },
  ] = await Promise.all([
    supabase.from("shift_requests").select("id", { count: "exact", head: true }).gte("created_at", new Date().toISOString().slice(0, 10)),
    supabase.from("shift_matches").select("id", { count: "exact", head: true }).gte("confirmed_at", new Date().toISOString().slice(0, 10)),
    supabase.from("reports").select("id", { count: "exact", head: true }).eq("status", "open"),
  ]);

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <h1 className="text-2xl font-bold text-stone-900">관리자 대시보드</h1>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-stone-200 bg-white p-4">
          <p className="text-sm text-stone-500">오늘 신규 공고</p>
          <p className="text-2xl font-bold">{shiftCount ?? 0}</p>
        </div>
        <div className="rounded-xl border border-stone-200 bg-white p-4">
          <p className="text-sm text-stone-500">오늘 매칭</p>
          <p className="text-2xl font-bold">{matchCount ?? 0}</p>
        </div>
        <div className="rounded-xl border border-stone-200 bg-white p-4">
          <p className="text-sm text-stone-500">미처리 신고</p>
          <p className="text-2xl font-bold">{reportCount ?? 0}</p>
        </div>
      </div>

      <section>
        <h2 className="text-lg font-semibold text-stone-900">신고 관리</h2>
        <p className="mt-1 text-sm text-stone-500">RLS 적용 후 신고 목록 조회 가능</p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-stone-900">사용자 관리</h2>
        <p className="mt-1 text-sm text-stone-500">사장님/근무자 구분, 상태 변경(active/suspended)</p>
      </section>
    </div>
  );
}
