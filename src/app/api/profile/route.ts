import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabaseClient";

export async function GET() {
  // Check if user is authenticated
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Use .single() to get a single object instead of an array
  const { data: userDetails, error } = await supabase
    .from("users")
    .select("*")
    .eq("auth_id", user.id)
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch user profile" },
      { status: 500 },
    );
  }

  if (!userDetails) {
    return NextResponse.json(
      { error: "User profile not found" },
      { status: 404 },
    );
  }

  return NextResponse.json(userDetails);
}
