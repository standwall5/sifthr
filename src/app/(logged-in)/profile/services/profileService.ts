import type { User, Module, Quiz } from "@/app/lib/models/types";
import { getUser, getUserModules, getUserQuizzes } from "@/lib/db/users";

export type Profile = User & {
  modules: Module[];
  quizzes: Quiz[];
  completionPercent: number;
  averageScore: number;
  letterGrade: string;
  profile_picture_url?: string;
};

export async function fetchProfile(userId: string): Promise<Profile> {
  const user = await getUser(userId);
  const { modules, modulePercent } = await getUserModules(userId);
  const { quizzes, averageScore, letterGrade } = await getUserQuizzes(userId);

  if (!user || !modules || !quizzes) {
    throw new Error("Failed to fetch profile");
  }

  return {
    ...user,
    modules,
    quizzes,
    averageScore,
    letterGrade,
    completionPercent: modulePercent,
  } as Profile;
}
