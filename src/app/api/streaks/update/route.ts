import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

async function getSupabaseClient() {
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
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch (e) {
            // Server Component
          }
        },
      },
    },
  );
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await getSupabaseClient();

    // Verify user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Get app user ID
    const { data: appUser } = await supabase
      .from("users")
      .select("id")
      .eq("auth_id", user.id)
      .single();

    if (!appUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Call the stored procedure
    const { error } = await supabase.rpc("update_user_streak", {
      p_user_id: appUser.id,
    });

    if (error) {
      console.error("Error updating streak:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Fetch updated streak
    const { data: streak } = await supabase
      .from("user_streaks")
      .select("*")
      .eq("user_id", appUser.id)
      .single();

    return NextResponse.json({ streak }, { status: 200 });
  } catch (error) {
    console.error("Error in POST /api/streaks/update:", error);
    return NextResponse.json(
      { error: "Failed to update streak" },
      { status: 500 },
    );
  }
}
