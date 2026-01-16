import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabaseClient";

export async function GET() {
  try {
    const { data: facts, error } = await supabase
      .from("daily_facts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching daily facts:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ facts });
  } catch (error) {
    console.error("Error in GET /api/admin/daily-facts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fact_text, language } = body;

    if (!fact_text || !language) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("daily_facts")
      .insert([
        {
          fact_text,
          language,
          is_active: true,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating daily fact:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ fact: data }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/admin/daily-facts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
