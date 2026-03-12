import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ensureUserProfile } from "@/lib/supabase/sync-user";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?next=/dashboard");
  }

  try {
    await ensureUserProfile(user.id, {
      name: user.user_metadata?.name,
      role: user.user_metadata?.role,
      phone: user.user_metadata?.phone,
    });
  } catch {
    // RLS or table not ready
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link href="/dashboard" className="text-lg font-bold text-primary">
            급구커버
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm text-stone-600 hover:text-stone-900">
              홈
            </Link>
            <Link
              href="/dashboard/owner/shifts/new"
              className="text-sm text-stone-600 hover:text-stone-900"
            >
              공백 등록
            </Link>
            <form action="/auth/logout" method="post">
              <button type="submit" className="text-sm text-stone-500 hover:underline">
                로그아웃
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}
