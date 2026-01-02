import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// GET /api/admin/badges - List all badges
export async function GET() {
  try {
    console.log("=== GET /api/admin/badges ===");

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: badges, error } = await supabase
      .from("badges")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Error fetching badges:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log("✅ Returning", badges?.length || 0, "badges");
    return NextResponse.json({ badges: badges || [] }, { status: 200 });
  } catch (error) {
    console.error("❌ Exception in GET /api/admin/badges:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/admin/badges - Create a new badge
export async function POST(req: NextRequest) {
  try {
    console.log("=== POST /api/admin/badges ===");

    const body = await req.json();
    console.log("Request body:", body);

    const { name, description, icon_url, badge_type, requirement_value } = body;

    if (!name || !badge_type) {
      return NextResponse.json(
        { error: "name and badge_type are required" },
        { status: 400 },
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: badge, error } = await supabase
      .from("badges")
      .insert([
        {
          name,
          description: description || null,
          icon_url: icon_url || null,
          badge_type, // Matches your database column
          requirement_value: requirement_value || null, // Matches your database column
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating badge:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log("✅ Badge created:", badge.id);
    return NextResponse.json({ badge }, { status: 201 });
  } catch (error) {
    console.error("❌ Exception in POST /api/admin/badges:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
