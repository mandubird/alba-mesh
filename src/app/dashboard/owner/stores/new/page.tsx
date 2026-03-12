"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function NewStorePage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    store_name: "",
    address: "",
    detail_address: "",
    phone: "",
    description: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/login");
        return;
      }
      const { data: profileUser } = await supabase
        .from("users")
        .select("id")
        .eq("auth_user_id", user.id)
        .single();
      if (!profileUser) {
        setError("먼저 회원 프로필이 생성되어야 합니다.");
        setLoading(false);
        return;
      }
      const { error: insertError } = await supabase.from("stores").insert({
        owner_user_id: profileUser.id,
        store_name: form.store_name,
        category: "cafe",
        address: form.address,
        detail_address: form.detail_address || null,
        phone: form.phone || null,
        description: form.description || null,
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

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-2xl font-bold text-stone-900">매장 등록</h1>
      <p className="mt-1 text-stone-600">긴급 공백을 등록하려면 먼저 매장을 등록해주세요.</p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
        )}
        <div>
          <label className="block text-sm font-medium text-stone-700">매장명 *</label>
          <input
            type="text"
            required
            value={form.store_name}
            onChange={(e) => setForm((f) => ({ ...f, store_name: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700">주소 *</label>
          <input
            type="text"
            required
            value={form.address}
            onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2"
            placeholder="예: 서울 성동구 성수동1가"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700">상세 주소</label>
          <input
            type="text"
            value={form.detail_address}
            onChange={(e) => setForm((f) => ({ ...f, detail_address: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700">매장 전화</label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700">설명</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
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
            {loading ? "등록 중..." : "매장 등록"}
          </button>
          <Link
            href="/dashboard/owner"
            className="rounded-lg border border-stone-300 px-4 py-2 font-medium text-stone-700 hover:bg-stone-50"
          >
            취소
          </Link>
        </div>
      </form>
    </div>
  );
}
