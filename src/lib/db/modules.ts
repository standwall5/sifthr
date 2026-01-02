import type { Module, ModuleSection, Quiz, Resource } from "@/lib/models/types";
import { supabase } from "@/app/lib/supabaseClient";

// TYPES
export type ModuleComplete = {
  module: Module;
  sections: ModuleSection[];
  quizzes: Quiz[];
  resources: Resource[];
};

export async function getModuleComplete(
  moduleId: number,
): Promise<ModuleComplete> {
  if (!Number.isFinite(moduleId) || moduleId <= 0) {
    throw new Error("Invalid module id");
  }

  const { data: module, error: moduleError } = await supabase
    .from("modules")
    .select("*")
    .eq("id", moduleId)
    .maybeSingle();

  if (moduleError || !module) {
    throw new Error(moduleError?.message ?? "Module not found");
  }

  const { data: sections, error: sectionsError } = await supabase
    .from("module_sections")
    .select("*")
    .eq("module_id", moduleId)
    .order("position", { ascending: true });

  if (sectionsError) {
    throw new Error(sectionsError.message);
  }

  const { data: quizzes, error: quizzesError } = await supabase
    .from("quizzes")
    .select("*")
    .eq("module_id", moduleId);

  if (quizzesError) {
    throw new Error(quizzesError.message);
  }

  const { data: resources, error: resourcesError } = await supabase
    .from("resources")
    .select("*")
    .eq("module_id", moduleId);

  if (resourcesError) {
    throw new Error(resourcesError.message);
  }

  return {
    module: module as Module,
    sections: (sections as ModuleSection[]) ?? [],
    quizzes: (quizzes as Quiz[]) ?? [],
    resources: (resources as Resource[]) ?? [],
  };
}

export async function getModules(): Promise<Module[] | { error: string }> {
  const { data, error } = await supabase
    .from("modules")
    .select("*")
    .order("id", { ascending: true });

  if (error || !data) {
    throw new Error(error?.message ?? "Failed to fetch modules");
  }

  return data as Module[];
}
