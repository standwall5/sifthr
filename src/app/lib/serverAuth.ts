import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { User } from "@/app/lib/models/types";

export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Ignore - likely in Server Component
          }
        },
      },
    },
  );
}

export async function getServerAppUser(): Promise<User | null> {
  try {
    const supabase = await createServerSupabaseClient();

    // Get the auth user
    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !authUser) {
      console.log("No auth user:", authError?.message);
      return null;
    }

    // Get app user from database
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("auth_id", authUser.id)
      .maybeSingle();

    if (error) {
      console.log("Error fetching app user:", error.message);
      return null;
    }

    return data as User;
  } catch (e) {
    console.error("Exception in getServerAppUser:", e);
    return null;
  }
}

export async function isServerAdmin(): Promise<boolean> {
  const appUser = await getServerAppUser();
  const result = !!appUser?.is_admin;
  console.log(`Admin check: ${appUser?.email} -> ${result}`);
  return result;
}
