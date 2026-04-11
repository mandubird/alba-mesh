import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-stone-100">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-wrap justify-between gap-6">
          <div>
            <Link href="/" className="text-lg font-bold text-primary">
              급구커버
            </Link>
            <p className="mt-2 max-w-sm text-sm text-stone-500">
              갑작스럽게 발생한 근무 공백을 사장님과 근무자를 빠르게 연결해 줍니다. 현재 미사역
              인근에서 베타(Pretotype) 테스트 중이며, 정식 출시 전 검증 단계입니다.
            </p>
          </div>
          <div className="flex flex-wrap gap-6">
            <Link href="/#intro" className="text-sm text-stone-600 hover:underline">
              서비스 소개
            </Link>
            <Link href="/terms" className="text-sm text-stone-600 hover:underline">
              이용약관
            </Link>
            <Link href="/privacy" className="text-sm text-stone-600 hover:underline">
              개인정보처리방침
            </Link>
            <Link href="/contact" className="text-sm text-stone-600 hover:underline">
              문의하기
            </Link>
            <Link href="/region" className="text-sm text-stone-600 hover:underline">
              운영 지역 안내
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
