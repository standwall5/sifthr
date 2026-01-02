// types.ts

export type User = {
  id: string;
  auth_id?: string;
  name: string;
  age?: number;
  email?: string;
  is_admin: boolean;
  profile_picture_url?: string;
  created_at: string;
};

export type Module = {
  id: number;
  title: string;
  description?: string;
  image_url?: string;
};

export type ModuleSection = {
  id: number;
  module_id: number;
  title: string;
  content?: string;
  media_url?: string;
  image_url?: string;
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
  question_type: "multipleChoice" | "input" | "checkbox" | "pinGame";
  position?: number;
  correct_answer?: string;
  image_url?: string;
  pin_x_coordinate?: number;
  pin_y_coordinate?: number;
  pin_tolerance?: number;
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

export type Badge = {
  id: number;
  name: string;
  description?: string;
  badge_type: "module_completion" | "milestone" | "streak" | "custom";
  icon_url?: string;
  requirement_value?: number;
  created_at: string;
};

export type UserBadge = {
  id: number;
  user_id: string;
  badge_id: number;
  earned_at: string;
  badge?: Badge;
};

export type UserStreak = {
  id: number;
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string;
};

export type Milestone = {
  id: number;
  name: string;
  description?: string;
  requirement_type: "modules_completed" | "quizzes_completed" | "total_score";
  requirement_value: number;
  badge_id?: number;
};

export type NewsArticle = {
  id: number;
  title: string;
  summary: string;
  link: string;
  thumbnail?: string;
  source: string;
  published_at: string;
  created_at?: string;
};
