import type { Module, ModuleSection, Quiz, Resource } from "@/lib/models/types";

export type ModuleComplete = {
  module: Module;
  sections: ModuleSection[];
  quizzes: Quiz[];
  resources: Resource[];
};

export async function fetchModuleComplete(id: string): Promise<ModuleComplete> {
  const res = await fetch(`/api/getModuleComplete/${id}`);
  if (!res.ok) throw new Error("Failed to fetch module");
  const data = (await res.json()) as ModuleComplete;
  return data;
}
