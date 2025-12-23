// types.ts

export type User = {
  id: string; // uuid from public.users
  auth_id?: string; // Supabase auth UUID
  name: string;
  age?: number;
  email?: string;
  is_admin: boolean;
  created_at: string;
};

export type Module = {
  id: number;
  title: string;
  description?: string;
};

export type ModuleSection = {
  id: number;
  module_id: number;
  title: string;
  content?: string;
  media_url?: string;
  position?: number;
};

export type Quiz = {
  id: number;
  module_id: number;
  title: string;
  description?: string;
};

export type Question = {
  id: number;
  quiz_id: number;
  question_text: string;
  question_type: "multipleChoice" | "input";
  position?: number;
  correct_answer?: string;
};

export type Answer = {
  id: number;
  question_id: number;
  answer_text: string;
  is_correct: boolean;
};

export type QuizSubmission = {
  id: number;
  quiz_id: number;
  user_id: string; // uuid references public.users(id)
  score: number;
  attempt: number;
  submitted_at: string;
};

export type UserAnswer = {
  id: number;
  quiz_submission_id: number;
  question_id: number;
  user_input?: string;
  is_correct?: boolean;
};

export type Resource = {
  id: number;
  module_id: number;
  title: string;
  link_url?: string;
  type?: string;
};

// lib/models/news.ts

export type NewsArticle = {
  id: string;

  title: string;
  summary: string;
  link: string;
  thumbnail: string | null;
  source: string;
  published_at: string; // ISO string

  created_at: string;
};
