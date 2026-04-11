import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "운영 지역 안내 | 급구커버",
  description: "급구커버 서비스 운영 지역",
};

export default function RegionPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-2xl font-bold text-stone-900">운영 지역 안내</h1>
        <p className="mt-4 text-stone-700">현재 서비스는 아래 지역에서만 운영됩니다.</p>
        <p className="mt-6 text-lg font-medium text-stone-900">
          👉 미사역 인근 (도보 10~15분 범위)
        </p>
        <p className="mt-4 text-sm text-stone-600">
          ※ 지역 외 요청은 매칭이 어려울 수 있습니다.
        </p>
      </main>
      <Footer />
    </>
  );
}
