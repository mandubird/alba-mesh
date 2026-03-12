"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { TASK_TAGS } from "@/types/database";

export default function NewShiftPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stores, setStores] = useState<{ id: string; store_name: string }[]>([]);
  const [ownerId, setOwnerId] = useState<string | null>(null);
  const [form, setForm] = useState({
    store_id: "",
    shift_date: "",
    start_time: "09:00",
    end_time: "18:00",
    hourly_wage: 12000,
    urgency_level: "high" as "normal" | "high" | "urgent",
    experience_required: true,
    allow_beginner: false,
    task_tags: [] as string[],
    memo: "",
    worker_type_preference: "any" as "any" | "worker_only" | "owner_worker_preferred",
  });

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: u } = await supabase.from("users").select("id").eq("auth_user_id", user.id).single();
      if (u) {
        setOwnerId(u.id);
        const { data: s } = await supabase.from("stores").select("id, store_name").eq("owner_user_id", u.id);
        setStores(s || []);
        if (s?.length === 1) setForm((f) => ({ ...f, store_id: s[0].id }));
      }
    })();
  }, [supabase]);

  function toggleTag(tag: string) {
    setForm((f) => ({
      ...f,
      task_tags: f.task_tags.includes(tag) ? f.task_tags.filter((t) => t !== tag) : [...f.task_tags, tag],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!ownerId || !form.store_id) {
      setError("매장을 먼저 등록해주세요.");
      return;
    }
    setLoading(true);
    try {
      const { error: insertError } = await supabase.from("shift_requests").insert({
        store_id: form.store_id,
        owner_user_id: ownerId,
        shift_date: form.shift_date,
        start_time: form.start_time,
        end_time: form.end_time,
        hourly_wage: form.hourly_wage,
        urgency_level: form.urgency_level,
        experience_required: form.experience_required,
        allow_beginner: form.allow_beginner,
        task_tags: form.task_tags,
        memo: form.memo || null,
        worker_type_preference: form.worker_type_preference,
        status: "open",
      });
      if (insertError) {
        setError(insertError.message);
        return;
      }
      router.push("/dashboard/owner");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-2xl font-bold text-stone-900">긴급 공백 등록</h1>
      <p className="mt-1 text-stone-600">날짜, 시간, 시급만 입력하면 1분 안에 등록할 수 있습니다.</p>

      {stores.length === 0 && (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm">
          매장이 없습니다.{" "}
          <Link href="/dashboard/owner/stores/new" className="font-medium text-primary hover:underline">
            매장 등록하기
          </Link>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
        )}

        <div>
          <label className="block text-sm font-medium text-stone-700">매장 *</label>
          <select
            required
            value={form.store_id}
            onChange={(e) => setForm((f) => ({ ...f, store_id: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2"
          >
            <option value="">선택</option>
            {stores.map((s) => (
              <option key={s.id} value={s.id}>
                {s.store_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700">근무 날짜 *</label>
          <input
            type="date"
            required
            min={today}
            value={form.shift_date}
            onChange={(e) => setForm((f) => ({ ...f, shift_date: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-700">시작 시간 *</label>
            <input
              type="time"
              required
              value={form.start_time}
              onChange={(e) => setForm((f) => ({ ...f, start_time: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700">종료 시간 *</label>
            <input
              type="time"
              required
              value={form.end_time}
              onChange={(e) => setForm((f) => ({ ...f, end_time: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700">시급 (원) *</label>
          <input
            type="number"
            required
            min={9860}
            value={form.hourly_wage}
            onChange={(e) => setForm((f) => ({ ...f, hourly_wage: Number(e.target.value) }))}
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700">업무 태그</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {TASK_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`rounded-full px-3 py-1 text-sm ${
                  form.task_tags.includes(tag)
                    ? "bg-primary text-white"
                    : "bg-stone-200 text-stone-700 hover:bg-stone-300"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.experience_required}
              onChange={(e) => setForm((f) => ({ ...f, experience_required: e.target.checked }))}
              className="rounded border-stone-300"
            />
            <span className="text-sm text-stone-700">경험자만 받기</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.allow_beginner}
              onChange={(e) => setForm((f) => ({ ...f, allow_beginner: e.target.checked }))}
              className="rounded border-stone-300"
            />
            <span className="text-sm text-stone-700">초보 가능</span>
          </label>
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700">긴급도</label>
          <select
            value={form.urgency_level}
            onChange={(e) =>
              setForm((f) => ({ ...f, urgency_level: e.target.value as "normal" | "high" | "urgent" }))
            }
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2"
          >
            <option value="normal">보통</option>
            <option value="high">긴급</option>
            <option value="urgent">매우 긴급</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700">선호 근무자</label>
          <select
            value={form.worker_type_preference}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                worker_type_preference: e.target.value as "any" | "worker_only" | "owner_worker_preferred",
              }))
            }
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2"
          >
            <option value="any">상관없음</option>
            <option value="worker_only">일반 근무자만</option>
            <option value="owner_worker_preferred">사장님 대타 우선</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700">추가 메모</label>
          <textarea
            value={form.memo}
            onChange={(e) => setForm((f) => ({ ...f, memo: e.target.value }))}
            rows={2}
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2"
            placeholder="준비물, 주소 상세 등"
          />
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading || stores.length === 0}
            className="rounded-lg bg-primary px-4 py-3 font-medium text-white hover:bg-primary-dark disabled:opacity-50"
          >
            {loading ? "등록 중..." : "지금 공백 등록하기"}
          </button>
          <Link
            href="/dashboard/owner"
            className="rounded-lg border border-stone-300 px-4 py-3 font-medium text-stone-700 hover:bg-stone-50"
          >
            취소
          </Link>
        </div>
      </form>
    </div>
  );
}
