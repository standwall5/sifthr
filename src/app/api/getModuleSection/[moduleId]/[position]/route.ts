import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabaseClient";
import type { ModuleSection } from "@/lib/models/types";

type Params = {
  moduleId: string;
  position: string;
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Params },
): Promise<
  NextResponse<
    { section: ModuleSection; totalPages: number } | { error: string }
  >
> {
  // Validate and parse params
  const moduleId = Number(params.moduleId);
  const position = Number(params.position);

  if (!Number.isFinite(moduleId) || moduleId <= 0) {
    return NextResponse.json({ error: "Invalid moduleId" }, { status: 400 });
  }
  if (!Number.isFinite(position) || position <= 0) {
    return NextResponse.json({ error: "Invalid position" }, { status: 400 });
  }

  // Fetch the specific section by module_id + position
  const { data: section, error: sectionError } = await supabase
    .from("module_sections")
    .select("*")
    .eq("module_id", moduleId)
    .eq("position", position)
    .maybeSingle();

  if (sectionError || !section) {
    return NextResponse.json(
      { error: sectionError?.message ?? "Section not found" },
      { status: 404 },
    );
  }

  // Count total sections (pages) for this module
  const { count, error: countError } = await supabase
    .from("module_sections")
    .select("*", { count: "exact", head: true })
    .eq("module_id", moduleId);

  if (countError) {
    return NextResponse.json({ error: countError.message }, { status: 500 });
  }

  return NextResponse.json({
    section: section as ModuleSection,
    totalPages: count ?? 0,
  });
}
