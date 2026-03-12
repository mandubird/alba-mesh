"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function SignupForm() {
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role") || "owner";
  const role = roleParam === "worker" ? "worker" : "owner";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name, phone, role } },
      });
      if (signUpError) {
        setError(signUpError.message);
        return;
      }
      if (authData.user) {
        // Supabase DB에 users 레코드 생성은 트리거 또는 API에서 처리 가능. MVP에서는 로그인 후 프로필 페이지에서 완료하도록 유도.
        router.push(
          role === "owner"
            ? "/dashboard/owner?onboard=1"
            : "/dashboard/worker?onboard=1"
        );
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="text-2xl font-bold text-stone-900">
        {role === "owner" ? "사장님 회원가입" : "대타 회원가입"}
      </h1>
      <p className="mt-2 text-sm text-stone-600">
        이미 계정이 있으면{" "}
        <Link href="/auth/login" className="text-primary hover:underline">
          로그인
        </Link>
      </p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
        )}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-stone-700">
            이름
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-stone-700">
            이메일
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-stone-700">
            비밀번호
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-stone-700">
            전화번호 (선택)
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-primary py-2 font-medium text-white hover:bg-primary-dark disabled:opacity-50"
        >
          {loading ? "가입 중..." : "가입하기"}
        </button>
      </form>
      <p className="mt-6 text-center">
        <Link href="/" className="text-sm text-stone-500 hover:underline">
          홈으로
        </Link>
      </p>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="p-16 text-center">로딩...</div>}>
      <SignupForm />
    </Suspense>
  );
}
