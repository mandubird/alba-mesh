import { createClient } from "@/lib/supabase/server";

export type Role = "owner" | "worker" | "owner_worker" | "admin";

export async function ensureUserProfile(authUserId: string, metadata: { name?: string; role?: string; phone?: string }) {
  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("users")
    .select("id")
    .eq("auth_user_id", authUserId)
    .single();

  if (existing) return existing.id;

  const role = (metadata.role as Role) || "owner";
  if (!["owner", "worker", "owner_worker", "admin"].includes(role)) {
    throw new Error("Invalid role");
  }
  const { data: inserted, error } = await supabase
    .from("users")
    .insert({
      auth_user_id: authUserId,
      role,
      name: metadata.name || "이름 없음",
      phone: metadata.phone || null,
      status: "active",
    })
    .select("id")
    .single();

  if (error) throw error;
  return inserted.id;
}
