"use client";

import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-white/95 pt-safe backdrop-blur supports-[backdrop-filter]:bg-white/90">
      <div className="mx-auto flex min-h-[52px] max-w-6xl items-center justify-between gap-4 px-4 sm:min-h-14 sm:px-5">
        <Link
          href="/"
          className="text-lg font-bold text-primary sm:text-xl"
        >
          급구커버
        </Link>
        <nav className="flex shrink-0 items-center" aria-label="주요 메뉴">
          <Link
            href="/#intro"
            className="rounded-lg px-3 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-100 hover:text-stone-900 active:bg-stone-100 sm:py-2"
          >
            서비스 소개
          </Link>
        </nav>
      </div>
    </header>
  );
}
