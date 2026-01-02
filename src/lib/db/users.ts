import type { User, Module, Quiz } from "@/lib/models/types";
import { supabase } from "@/app/lib/supabaseClient";

// For Profile Page - User details (getUser), Modules and Quizzes completed by user
export async function getUser(id: string): Promise<User | { error: string }> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Failed to fetch user");
  }

  return data as User;
}

export async function getUserModules(
  id: string,
): Promise<{ modules: Module[]; modulePercent: number }> {
  const { data: moduleProgressData, error: moduleProgressError } =
    await supabase
      .from("module_progress")
      .select("module_id")
      .eq("user_id", id);

  if (moduleProgressError || !moduleProgressData) {
    throw new Error(
      moduleProgressError?.message ?? "Failed to fetch user modules",
    );
  }

  const moduleIds = (moduleProgressData as { module_id: string }[]).map(
    (mp) => mp.module_id,
  );

  const { data: allModules, error: allModulesError } = await supabase
    .from("modules")
    .select("*");

  if (allModulesError || !allModules) {
    throw new Error(allModulesError?.message ?? "Failed to fetch all modules");
  }

  // Fetch modules name, description.
  const { data: moduleData, error: moduleError } = await supabase
    .from("modules")
    .select("*")
    .in("id", moduleIds);

  if (moduleError || !moduleData) {
    throw new Error(moduleError?.message ?? "Failed to fetch user modules");
  }

  // Calculate percent
  const modulePercent =
    allModules.length === 0 ? 0 : (moduleData.length / allModules.length) * 100;

  return {
    modules: moduleData as Module[],
    modulePercent,
  };
}
function getLetterGrade(score: number): string {
  if (score >= 93) return "A";
  if (score >= 90) return "A-";
  if (score >= 87) return "B+";
  if (score >= 83) return "B";
  if (score >= 80) return "B-";
  if (score >= 77) return "C+";
  if (score >= 73) return "C";
  if (score >= 70) return "C-";
  if (score >= 60) return "D";
  return "F";
}

export async function getUserQuizzes(
  id: string,
): Promise<{ quizzes: Quiz[]; averageScore: number; letterGrade: string }> {
  const { data: quizSubmissions, error: quizSubmissionsError } = await supabase
    .from("quiz_submissions")
    .select("*")
    .eq("user_id", id);

  if (quizSubmissionsError || !quizSubmissions) {
    throw new Error(
      quizSubmissionsError?.message ?? "Failed to fetch user quizzes",
    );
  }

  // Calculate average score
  let averageScore = 0;
  let letterGrade = "N/A";
  if (quizSubmissions.length > 0) {
    const total = quizSubmissions.reduce((sum, q) => sum + (q.score ?? 0), 0);
    averageScore = total / quizSubmissions.length;
    letterGrade = getLetterGrade(averageScore);
  }

  // Fetch quizzes name, description.
  const { data: quizData, error: quizError } = await supabase
    .from("quizzes")
    .select("*")
    .in(
      "id",
      quizSubmissions.map((qs) => qs.quiz_id),
    );

  if (quizError || !quizData) {
    throw new Error(quizError?.message ?? "Failed to fetch user quizzes");
  }

  return {
    quizzes: quizData as Quiz[],
    averageScore,
    letterGrade,
  };
}

// End of Profile Page
