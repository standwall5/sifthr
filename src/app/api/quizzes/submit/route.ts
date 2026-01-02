import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

async function getSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch (e) {
            // Server Component
          }
        },
      },
    },
  );
}

type UserAnswer = {
  question_id: number;
  user_input: string | null;
  is_correct: boolean;
};

export async function POST(req: NextRequest) {
  try {
    console.log("=== POST /api/quizzes/submit ===");

    const supabase = await getSupabaseClient();

    // Verify user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    console.log("Auth check:", {
      hasUser: !!user,
      userId: user?.id,
      error: authError?.message,
    });

    if (authError || !user) {
      console.log("❌ No auth user, returning 401");
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Get the app user ID
    const { data: appUser, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("auth_id", user.id)
      .single();

    if (userError || !appUser) {
      console.log("❌ App user not found");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const {
      quiz_id,
      score,
      answers,
    }: {
      quiz_id: number;
      score: number;
      answers: UserAnswer[];
    } = await req.json();

    if (!quiz_id || score === undefined || !answers) {
      return NextResponse.json(
        { error: "quiz_id, score, and answers are required" },
        { status: 400 },
      );
    }

    console.log("✅ User authenticated, submitting quiz:", quiz_id);

    // Get previous attempts count
    const { data: previousAttempts } = await supabase
      .from("quiz_submissions")
      .select("attempt")
      .eq("quiz_id", quiz_id)
      .eq("user_id", appUser.id)
      .order("attempt", { ascending: false })
      .limit(1);

    const attemptNumber = previousAttempts?.[0]?.attempt
      ? previousAttempts[0].attempt + 1
      : 1;

    // Create quiz submission
    const { data: submission, error: submissionError } = await supabase
      .from("quiz_submissions")
      .insert([
        {
          quiz_id,
          user_id: appUser.id,
          score: Math.round(score),
          attempt: attemptNumber,
        },
      ])
      .select()
      .single();

    if (submissionError || !submission) {
      console.error("Error creating submission:", submissionError);
      return NextResponse.json(
        { error: submissionError?.message || "Failed to create submission" },
        { status: 500 },
      );
    }

    console.log("✅ Quiz submission created:", submission.id);

    // Save user answers
    const answersToInsert = answers.map((a) => ({
      quiz_submission_id: submission.id,
      question_id: a.question_id,
      user_input: a.user_input,
      is_correct: a.is_correct,
    }));

    const { error: answersError } = await supabase
      .from("user_answers")
      .insert(answersToInsert);

    if (answersError) {
      console.error("Error saving answers:", answersError);
      return NextResponse.json(
        { error: "Failed to save answers" },
        { status: 500 },
      );
    }

    console.log("✅ User answers saved");

    return NextResponse.json(
      {
        success: true,
        submission_id: submission.id,
        attempt: attemptNumber,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("❌ Error in POST /api/quizzes/submit:", error);
    return NextResponse.json(
      { error: "Failed to submit quiz", details: String(error) },
      { status: 500 },
    );
  }
}
