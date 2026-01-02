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
            // The `setAll` method was called from a Server Component.
          }
        },
      },
    },
  );
}

// GET /api/admin/sections?module_id=X - List sections for a module
export async function GET(req: NextRequest) {
  try {
    console.log("=== GET /api/admin/sections ===");

    const supabase = await getSupabaseClient();
    const { searchParams } = new URL(req.url);
    const moduleId = searchParams.get("module_id");

    // Verify user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    console.log("Auth check:", {
      hasUser: !!user,
      userId: user?.id,
      error: authError?.message,
    });

    if (authError || !user) {
      console.log("❌ No auth user, returning 401");
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Check if user is admin
    const { data: appUser, error: userError } = await supabase
      .from("users")
      .select("is_admin")
      .eq("auth_id", user.id)
      .single();

    console.log("Admin check:", {
      hasAppUser: !!appUser,
      isAdmin: appUser?.is_admin,
      error: userError?.message,
    });

    if (userError || !appUser?.is_admin) {
      console.log("❌ Not admin, returning 403");
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 },
      );
    }

    let query = supabase
      .from("module_sections")
      .select("*")
      .order("position", { ascending: true });

    if (moduleId) {
      query = query.eq("module_id", parseInt(moduleId));
    }

    const { data: sections, error } = await query;

    if (error) {
      console.error("Error fetching sections:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log("✅ Returning", sections?.length || 0, "sections");
    return NextResponse.json({ sections: sections || [] }, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/admin/sections:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/admin/sections - Create a new section
export async function POST(req: NextRequest) {
  try {
    console.log("=== POST /api/admin/sections ===");

    const supabase = await getSupabaseClient();

    // Verify user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    console.log("Auth check:", {
      hasUser: !!user,
      userId: user?.id,
      error: authError?.message,
    });

    if (authError || !user) {
      console.log("❌ No auth user, returning 401");
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Check if user is admin
    const { data: appUser, error: userError } = await supabase
      .from("users")
      .select("is_admin")
      .eq("auth_id", user.id)
      .single();

    console.log("Admin check:", {
      hasAppUser: !!appUser,
      isAdmin: appUser?.is_admin,
      error: userError?.message,
    });

    if (userError || !appUser?.is_admin) {
      console.log("❌ Not admin, returning 403");
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 },
      );
    }

    const body = await req.json();
    const { module_id, title, content, media_url, image_url, position } = body;

    if (!module_id || !title) {
      return NextResponse.json(
        { error: "module_id and title are required" },
        { status: 400 },
      );
    }

    console.log("✅ User is admin, creating section:", title);

    const { data: section, error } = await supabase
      .from("module_sections")
      .insert([
        {
          module_id: parseInt(module_id),
          title,
          content: content || null,
          media_url: media_url || null,
          image_url: image_url || null,
          position: position !== undefined ? parseInt(position) : null,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating section:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log("✅ Section created:", section.id);
    return NextResponse.json({ section }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/admin/sections:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
