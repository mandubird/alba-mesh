import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "개인정보처리방침 | 급구커버",
  description: "급구커버 Pretotype·베타 단계 개인정보처리방침(간단 버전)",
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-2xl font-bold text-stone-900">개인정보처리방침 (간단 버전)</h1>
        <p className="mt-2 text-sm text-stone-500">
          본 방침은 Pretotype·베타 단계를 위한 요약 안내입니다.
        </p>

        <p className="mt-8 text-stone-700">급구커버는 최소한의 정보만 수집합니다.</p>

        <section className="mt-8 text-stone-700">
          <h2 className="text-lg font-semibold text-stone-900">수집 항목</h2>
          <ul className="mt-3 list-inside list-disc space-y-1">
            <li>이름 (또는 닉네임)</li>
            <li>전화번호 (선택)</li>
            <li>활동 기록 (출근 여부 등)</li>
          </ul>
        </section>

        <section className="mt-8 text-stone-700">
          <h2 className="text-lg font-semibold text-stone-900">사용 목적</h2>
          <ul className="mt-3 list-inside list-disc space-y-1">
            <li>매칭 진행</li>
            <li>신뢰도 관리 (출근률 등)</li>
          </ul>
        </section>

        <p className="mt-8 text-stone-700">
          개인정보는 외부에 제공되지 않으며, 서비스 운영 목적 외에는 사용되지 않습니다.
        </p>
      </main>
      <Footer />
    </>
  );
}
