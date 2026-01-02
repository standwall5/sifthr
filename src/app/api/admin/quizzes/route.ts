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
            // The `setAll` method was called from a Server Component.
          }
        },
      },
    },
  );
}

type Answer = {
  answer_text: string;
  is_correct: boolean;
};

type Question = {
  question_text: string;
  question_type: "multipleChoice" | "input" | "checkbox" | "pinGame";
  correct_answer?: string;
  answers: Answer[];
  image_url?: string;
  pin_x_coordinate?: number;
  pin_y_coordinate?: number;
  pin_tolerance?: number;
};

export async function POST(req: NextRequest) {
  try {
    console.log("=== POST /api/admin/quizzes ===");

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

    // Check if user is admin
    const { data: appUser, error: userError } = await supabase
      .from("users")
      .select("is_admin")
      .eq("auth_id", user.id)
      .single();

    console.log("Admin check:", {
      hasAppUser: !!appUser,
      isAdmin: appUser?.is_admin,
      error: userError?.message,
    });

    if (userError || !appUser?.is_admin) {
      console.log("❌ Not admin, returning 403");
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 },
      );
    }

    const {
      module_id,
      title,
      description,
      questions,
    }: {
      module_id: number;
      title: string;
      description: string;
      questions: Question[];
    } = await req.json();

    if (!module_id || !title || !questions || questions.length === 0) {
      return NextResponse.json(
        { error: "Module ID, title, and at least one question are required" },
        { status: 400 },
      );
    }

    console.log("✅ User is admin, creating quiz:", title);

    // Create quiz
    const { data: quiz, error: quizError } = await supabase
      .from("quizzes")
      .insert([{ module_id, title, description }])
      .select()
      .single();

    if (quizError || !quiz) {
      console.error("Error creating quiz:", quizError);
      return NextResponse.json(
        { error: quizError?.message || "Failed to create quiz" },
        { status: 500 },
      );
    }

    console.log("✅ Quiz created:", quiz.id);

    // Create questions
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];

      const questionData: {
        quiz_id: number;
        question_text: string;
        question_type: string;
        position: number;
        correct_answer: string | null;
        image_url?: string | null;
        pin_x_coordinate?: number | null;
        pin_y_coordinate?: number | null;
        pin_tolerance?: number;
      } = {
        quiz_id: quiz.id,
        question_text: q.question_text,
        question_type: q.question_type,
        position: i + 1,
        correct_answer:
          q.question_type === "input" ? q.correct_answer || null : null,
      };

      // Add pin game fields if applicable
      if (q.question_type === "pinGame") {
        questionData.image_url = q.image_url || null;
        questionData.pin_x_coordinate = q.pin_x_coordinate || null;
        questionData.pin_y_coordinate = q.pin_y_coordinate || null;
        questionData.pin_tolerance = q.pin_tolerance || 50;
      }

      const { data: question, error: questionError } = await supabase
        .from("questions")
        .insert([questionData])
        .select()
        .single();

      if (questionError || !question) {
        console.error(`Error creating question ${i + 1}:`, questionError);
        return NextResponse.json(
          {
            error: `Failed to create question ${i + 1}: ${questionError?.message}`,
          },
          { status: 500 },
        );
      }

      console.log(`✅ Question ${i + 1} created:`, question.id);

      // Create answers (for multiple choice/checkbox)
      if (
        q.question_type !== "input" &&
        q.question_type !== "pinGame" &&
        q.answers.length > 0
      ) {
        const answersToInsert = q.answers.map((a) => ({
          question_id: question.id,
          answer_text: a.answer_text,
          is_correct: a.is_correct,
        }));

        const { error: answersError } = await supabase
          .from("answers")
          .insert(answersToInsert);

        if (answersError) {
          console.error(
            `Error creating answers for question ${i + 1}:`,
            answersError,
          );
          return NextResponse.json(
            { error: `Failed to create answers for question ${i + 1}` },
            { status: 500 },
          );
        }

        console.log(`✅ Answers created for question ${i + 1}`);
      }
    }

    console.log("✅ Quiz fully created with all questions");
    return NextResponse.json(
      { success: true, quiz_id: quiz.id },
      { status: 201 },
    );
  } catch (error) {
    console.error("❌ Error in POST /api/admin/quizzes:", error);
    return NextResponse.json(
      { error: "Failed to create quiz", details: String(error) },
      { status: 500 },
    );
  }
}
