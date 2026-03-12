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
          <Link href="/auth/signup?role=owner" className="text-sm text-stone-600 hover:text-stone-900">
            사장님으로 시작하기
          </Link>
          <Link href="/auth/signup?role=worker" className="text-sm text-stone-600 hover:text-stone-900">
            대타로 참여하기
          </Link>
          <Link href="/auth/login" className="text-sm text-stone-600 hover:text-stone-900">
            로그인
          </Link>
          <Link
            href="/dashboard/owner/shifts/new"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
          >
            지금 공백 등록하기
          </Link>
        </nav>
      </div>
    </header>
  );
}
