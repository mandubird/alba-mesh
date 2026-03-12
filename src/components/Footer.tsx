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
            <p className="mt-2 text-sm text-stone-500">
              현재 MVP: 카페 / 1개 지역 한정 운영
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
