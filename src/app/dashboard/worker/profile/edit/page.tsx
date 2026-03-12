"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { EXPERIENCE_TAGS } from "@/types/database";

export default function EditWorkerProfilePage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [form, setForm] = useState({
    years_of_experience: 0,
    experience_tags: [] as string[],
    availability_tags: [] as string[],
    radius_km: 3,
    can_start_immediately: false,
    intro: "",
    is_owner_worker: false,
  });

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/login");
        return;
      }
      const { data: u } = await supabase.from("users").select("id").eq("auth_user_id", user.id).single();
      if (!u) return;
      setUserId(u.id);
      const { data: wp } = await supabase.from("worker_profiles").select("*").eq("user_id", u.id).single();
      if (wp) {
        setForm({
          years_of_experience: wp.years_of_experience ?? 0,
          experience_tags: wp.experience_tags ?? [],
          availability_tags: wp.availability_tags ?? [],
          radius_km: wp.radius_km ?? 3,
          can_start_immediately: wp.can_start_immediately ?? false,
          intro: wp.intro ?? "",
          is_owner_worker: wp.is_owner_worker ?? false,
        });
      }
      setFetching(false);
    })();
  }, [router, supabase]);

  function toggleExpTag(tag: string) {
    setForm((f) => ({
      ...f,
      experience_tags: f.experience_tags.includes(tag)
        ? f.experience_tags.filter((t) => t !== tag)
        : [...f.experience_tags, tag],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) return;
    setLoading(true);
    try {
      const { error } = await supabase.from("worker_profiles").upsert(
        {
          user_id: userId,
          years_of_experience: form.years_of_experience,
          experience_tags: form.experience_tags,
          availability_tags: form.availability_tags,
          radius_km: form.radius_km,
          can_start_immediately: form.can_start_immediately,
          intro: form.intro || null,
          is_owner_worker: form.is_owner_worker,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );
      if (error) throw error;
      router.push("/dashboard/worker/profile");
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("저장에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }

  if (fetching) return <div className="p-8 text-center text-stone-500">로딩 중...</div>;

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-2xl font-bold text-stone-900">프로필 수정</h1>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label className="block text-sm font-medium text-stone-700">카페 경력 (년)</label>
          <input
            type="number"
            min={0}
            value={form.years_of_experience}
            onChange={(e) => setForm((f) => ({ ...f, years_of_experience: Number(e.target.value) }))}
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700">경험/가능 태그</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {EXPERIENCE_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleExpTag(tag)}
                className={`rounded-full px-3 py-1 text-sm ${
                  form.experience_tags.includes(tag) ? "bg-primary text-white" : "bg-stone-200 text-stone-700"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700">탐색 반경 (km)</label>
          <select
            value={form.radius_km}
            onChange={(e) => setForm((f) => ({ ...f, radius_km: Number(e.target.value) }))}
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2"
          >
            {[1, 2, 3, 5, 10].map((n) => (
              <option key={n} value={n}>
                {n}km
              </option>
            ))}
          </select>
        </div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.can_start_immediately}
            onChange={(e) => setForm((f) => ({ ...f, can_start_immediately: e.target.checked }))}
            className="rounded border-stone-300"
          />
          <span className="text-sm text-stone-700">지금 출발 가능</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.is_owner_worker}
            onChange={(e) => setForm((f) => ({ ...f, is_owner_worker: e.target.checked }))}
            className="rounded border-stone-300"
          />
          <span className="text-sm text-stone-700">사장님이면서 대타도 가능 (사장님 대타)</span>
        </label>
        <div>
          <label className="block text-sm font-medium text-stone-700">한줄 소개</label>
          <textarea
            value={form.intro}
            onChange={(e) => setForm((f) => ({ ...f, intro: e.target.value }))}
            rows={2}
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2"
          />
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-primary px-4 py-2 font-medium text-white hover:bg-primary-dark disabled:opacity-50"
          >
            {loading ? "저장 중..." : "저장"}
          </button>
          <Link href="/dashboard/worker/profile" className="rounded-lg border border-stone-300 px-4 py-2 font-medium">
            취소
          </Link>
        </div>
      </form>
    </div>
  );
}
