import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(req: NextRequest) {
  try {
    console.log("=== POST /api/modules/complete ===");

    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");

    // Create client with the user's token (not service role)
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });

    // Get the authenticated user
    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !authUser) {
      console.log("❌ Not authenticated:", authError);
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Get app user
    const { data: appUser, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("auth_id", authUser.id)
      .single();

    if (userError || !appUser) {
      console.log("❌ App user not found:", userError);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userId = appUser.id;
    console.log("✅ User authenticated:", userId);

    const { module_id, module_section_id } = await req.json();

    if (!module_id || !module_section_id) {
      return NextResponse.json(
        { error: "Module ID and section ID are required" },
        { status: 400 },
      );
    }

    console.log("📊 Request data:", { module_id, module_section_id, userId });

    // Check if already completed
    const { data: existing } = await supabase
      .from("module_progress")
      .select("*")
      .eq("user_id", userId)
      .eq("module_id", module_id)
      .eq("module_section_id", module_section_id)
      .maybeSingle();

    if (existing) {
      console.log("⚠️ Already completed");
      return NextResponse.json(
        { message: "Already completed" },
        { status: 200 },
      );
    }

    // Insert progress - RLS will now work because auth.uid() exists
    console.log("📝 Inserting module progress...");
    const { data: inserted, error: insertError } = await supabase
      .from("module_progress")
      .insert([
        {
          user_id: userId,
          module_id,
          module_section_id,
        },
      ])
      .select();

    if (insertError) {
      console.log("❌ Insert error:", insertError);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    console.log("✅ Insert successful:", inserted);

    // Check if module is fully completed
    const { data: allSections } = await supabase
      .from("module_sections")
      .select("id")
      .eq("module_id", module_id);

    const { data: completedSections } = await supabase
      .from("module_progress")
      .select("module_section_id")
      .eq("user_id", userId)
      .eq("module_id", module_id);

    const isModuleComplete = allSections?.length === completedSections?.length;

    console.log("✅ Module progress saved. Complete:", isModuleComplete);

    return NextResponse.json(
      {
        success: true,
        module_complete: isModuleComplete,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("❌ Exception in POST /api/modules/complete:", error);
    return NextResponse.json(
      { error: "Failed to mark as complete" },
      { status: 500 },
    );
  }
}
