import Link from "next/link";
import { CONTACT_EMAIL } from "@/lib/contact";

export function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-stone-100 pb-safe">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-5">
        <div className="flex flex-col gap-10 sm:flex-row sm:justify-between sm:gap-8">
          <div className="max-w-md">
            <Link href="/" className="text-lg font-bold text-primary">
              급구커버
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-stone-500">
              갑작스럽게 발생한 근무 공백을 사장님과 근무자를 빠르게 연결해 줍니다. 현재 미사역
              인근에서 베타(Pretotype) 테스트 중이며, 정식 출시 전 검증 단계입니다.
            </p>
          </div>
          <nav
            className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:gap-x-8 sm:gap-y-2"
            aria-label="푸터 링크"
          >
            <Link
              href="/#intro"
              className="text-sm font-medium text-stone-600 hover:text-stone-900 sm:py-1"
            >
              서비스 소개
            </Link>
            <Link
              href="/terms"
              className="text-sm font-medium text-stone-600 hover:text-stone-900 sm:py-1"
            >
              이용약관
            </Link>
            <Link
              href="/privacy"
              className="text-sm font-medium text-stone-600 hover:text-stone-900 sm:py-1"
            >
              개인정보처리방침
            </Link>
            <div className="flex flex-col gap-1.5 sm:py-1">
              <Link
                href="/contact"
                className="text-sm font-medium text-stone-600 hover:text-stone-900"
              >
                문의하기
              </Link>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="break-all text-xs text-stone-500 hover:text-stone-700 hover:underline sm:text-sm"
              >
                {CONTACT_EMAIL}
              </a>
            </div>
            <Link
              href="/region"
              className="text-sm font-medium text-stone-600 hover:text-stone-900 sm:py-1"
            >
              운영 지역 안내
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
