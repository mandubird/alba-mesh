import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "이용약관 | 급구커버",
  description: "급구커버 Pretotype·베타 단계 이용약관(간단 버전)",
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-2xl font-bold text-stone-900">이용약관 (간단 버전)</h1>
        <p className="mt-2 text-sm text-stone-500">
          본 약관은 Pretotype·베타 단계를 위한 요약 안내입니다.
        </p>

        <section className="mt-10 space-y-4 text-stone-700">
          <h2 className="text-lg font-semibold text-stone-900">서비스 성격</h2>
          <p>
            본 서비스는 사장님과 근무자를 연결해 주는 &quot;매칭 서비스&quot;입니다. 급구커버는
            고용주 또는 근로계약의 당사자가 아닙니다.
          </p>
        </section>

        <section className="mt-10 space-y-4 text-stone-700">
          <h2 className="text-lg font-semibold text-stone-900">책임 범위</h2>
          <p>
            근무 조건(시급, 업무 내용 등) 및 급여 지급은 사장님과 근무자 간 직접 협의 및 진행됩니다.
          </p>
          <p>급구커버는 매칭 이후 발생하는 문제에 대해 책임을 지지 않습니다.</p>
        </section>

        <section className="mt-10 space-y-4 text-stone-700">
          <h2 className="text-lg font-semibold text-stone-900">서비스 제한</h2>
          <p>
            노쇼, 허위 정보 제공 등의 문제가 발생할 경우 서비스 이용이 제한될 수 있습니다.
          </p>
        </section>

        <section className="mt-10 rounded-lg border border-amber-200 bg-amber-50/80 p-4 text-sm text-stone-700">
          <p className="font-medium text-stone-900">베타 테스트 안내</p>
          <p className="mt-2">
            중개 수수료는 무료이며, 매칭은 보장되지 않습니다(상황에 따라 실패할 수 있음). 급구커버는
            연결만 제공하며, 근무 조건 및 급여는 당사자 간 직접 진행됩니다.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
