import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabaseClient";
import type { Module } from "@/lib/models/types";

export async function GET(): Promise<
  NextResponse<Module[] | { error: string }>
> {
  const { data, error } = await supabase
    .from("modules")
    .select("*")
    .order("id", { ascending: true });

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message ?? "Failed to fetch modules" },
      { status: 500 },
    );
  }

  return NextResponse.json(data as Module[]);
}
