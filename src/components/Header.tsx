"use client";

import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold text-primary">
          급구커버
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/#intro" className="text-sm text-stone-600 hover:text-stone-900">
            서비스 소개
          </Link>
        </nav>
      </div>
    </header>
  );
}
