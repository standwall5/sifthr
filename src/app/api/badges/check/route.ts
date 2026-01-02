import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabaseClient";
import { getCurrentUserId } from "@/app/lib/userHelpers";

export async function POST(req: NextRequest) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const { data: newBadges, error } = await supabase
      .from("user_badges")
      .select(
        `
        *,
        badge:badges(*)
      `,
      )
      .eq("user_id", userId)
      .gte("earned_at", new Date(Date.now() - 5000).toISOString()); // Last 5 seconds

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ badges: newBadges || [] }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to check badges" },
      { status: 500 },
    );
  }
}
