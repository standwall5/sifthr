import { supabase } from "@/app/lib/supabaseClient";
import type { User } from "@/lib/models/types";

/**
 * Get the current Supabase Auth user (auth.users).
 * Returns null if not authenticated.
 */
export async function getCurrentAuthUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    // If auth is not initialized or no session, return null rather than throwing
    return null;
  }
  return data.user ?? null;
}

/**
 * Get the current application user (public.users) by linking via auth_id = auth.uid().
 * Returns null if there is no auth session or the user row is not found/accessible via RLS.
 */
export async function getCurrentAppUser(): Promise<User | null> {
  const authUser = await getCurrentAuthUser();
  if (!authUser) return null;

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("auth_id", authUser.id)
    .limit(1)
    .maybeSingle();

  if (error) {
    // If RLS blocks or row doesn't exist, return null; caller can handle upsert or redirect
    return null;
  }

  return (data as User) ?? null;
}

/**
 * Ensure the application user row (public.users) exists and is linked to the current auth user via auth_id.
 * If not present, upsert a row with provided partial values.
 * Returns the resulting application user or null if not authenticated.
 */
export async function ensureAppUserUpsert(
  partial: Partial<User> = {},
): Promise<User | null> {
  const authUser = await getCurrentAuthUser();
  if (!authUser) return null;

  const { error } = await supabase.from("users").upsert(
    {
      auth_id: authUser.id,
      name: partial.name ?? authUser.email ?? "User",
      email: partial.email ?? authUser.email ?? undefined,
      age: partial.age ?? undefined,
      is_admin: partial.is_admin ?? false,
    },
    { onConflict: "auth_id" },
  );

  if (error) {
    // Upsert failed (e.g., RLS or constraint); return null so caller can decide next steps
    return null;
  }

  return await getCurrentAppUser();
}

/**
 * Returns true if the current user is an admin based on public.users.is_admin.
 * If not authenticated or user row not found, returns false.
 */
export async function isAdmin(): Promise<boolean> {
  const appUser = await getCurrentAppUser();
  return !!appUser?.is_admin;
}

/**
 * Get the current user's UUID (public.users.id).
 * Useful for owner-scoped inserts, e.g., quiz_submissions.user_id.
 * Returns null if unauthenticated or user row not found.
 */
export async function getCurrentUserId(): Promise<string | null> {
  const appUser = await getCurrentAppUser();
  return appUser?.id ?? null;
}

/**
 * Utility: require authentication and a linked app user.
 * Throws an Error if missing; otherwise returns the app user.
 */
export async function requireAppUser(): Promise<User> {
  const user = await getCurrentAppUser();
  if (!user) {
    throw new Error("Not authenticated or user not linked. Please sign in.");
  }
  return user;
}
