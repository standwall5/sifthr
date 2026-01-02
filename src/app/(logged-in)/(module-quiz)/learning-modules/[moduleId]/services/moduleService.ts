import type { Module, ModuleSection, Quiz, Resource } from "@/lib/models/types";
import { getModuleComplete } from "@/lib/db/modules"; // server DB layer

export type ModuleComplete = {
  module: Module;
  sections: ModuleSection[];
  quizzes: Quiz[];
  resources: Resource[];
};

// server function calling DB directly
export async function fetchModuleComplete(
  id: string,
): Promise<ModuleComplete | null> {
  try {
    const data = await getModuleComplete(Number(id));
    if (!data) return null;
    return data;
  } catch (error) {
    // Optionally log error or handle it as needed
    console.log("Error: ", error);
    return null;
  }
}
