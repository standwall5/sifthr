import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabaseClient";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const language = searchParams.get("language") || "en";

    // Get a random active fact for the specified language
    const { data: facts, error } = await supabase
      .from("daily_facts")
      .select("*")
      .eq("language", language)
      .eq("is_active", true);

    if (error) {
      console.error("Error fetching daily fact:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!facts || facts.length === 0) {
      return NextResponse.json(
        { error: "No facts available" },
        { status: 404 }
      );
    }

    // Select a random fact
    const randomFact = facts[Math.floor(Math.random() * facts.length)];

    return NextResponse.json({ fact: randomFact });
  } catch (error) {
    console.error("Error in GET /api/daily-fact:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
