import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabaseClient";
import type { Module, ModuleSection, Quiz, Resource } from "@/lib/models/types";

type Params = {
  moduleId: string;
};

type ModuleComplete = {
  module: Module;
  sections: ModuleSection[];
  quizzes: Quiz[];
  resources: Resource[];
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Params },
): Promise<NextResponse<ModuleComplete | { error: string }>> {
  const id = Number(params.moduleId);

  if (!Number.isFinite(id) || id <= 0) {
    return NextResponse.json({ error: "Invalid module id" }, { status: 400 });
  }

  // Fetch module details
  const { data: module, error: moduleError } = await supabase
    .from("modules")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (moduleError || !module) {
    return NextResponse.json(
      { error: moduleError?.message ?? "Module not found" },
      { status: 404 },
    );
  }

  // Fetch all sections for this module
  const { data: sections, error: sectionsError } = await supabase
    .from("module_sections")
    .select("*")
    .eq("module_id", id)
    .order("position", { ascending: true });

  if (sectionsError) {
    return NextResponse.json({ error: sectionsError.message }, { status: 500 });
  }

  // Fetch all quizzes for this module
  const { data: quizzes, error: quizzesError } = await supabase
    .from("quizzes")
    .select("*")
    .eq("module_id", id);

  if (quizzesError) {
    return NextResponse.json({ error: quizzesError.message }, { status: 500 });
  }

  // Fetch all resources for this module
  const { data: resources, error: resourcesError } = await supabase
    .from("resources")
    .select("*")
    .eq("module_id", id);

  if (resourcesError) {
    return NextResponse.json(
      { error: resourcesError.message },
      { status: 500 },
    );
  }

  return NextResponse.json({
    module: module as Module,
    sections: (sections as ModuleSection[]) || [],
    quizzes: (quizzes as Quiz[]) || [],
    resources: (resources as Resource[]) || [],
  });
}
