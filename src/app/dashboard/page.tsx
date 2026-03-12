import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardHome() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  // role은 가입 시 metadata에 저장. DB users 테이블은 트리거로 채울 수 있음. MVP에서는 간단히 링크만 제공
  const role = (user.user_metadata?.role as string) || "owner";

  if (role === "worker") {
    redirect("/dashboard/worker");
  }
  redirect("/dashboard/owner");
}
