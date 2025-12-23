import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabaseClient";
import type { Quiz } from "@/lib/models/types";

export async function GET(): Promise<NextResponse<Quiz[] | { error: string }>> {
  const { data, error } = await supabase
    .from("quizzes")
    .select("*")
    .order("id", { ascending: true });

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message ?? "Failed to fetch quizzes" },
      { status: 500 },
    );
  }

  return NextResponse.json(data as Quiz[]);
}
