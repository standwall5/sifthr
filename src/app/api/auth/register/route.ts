import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabaseClient";

type RegisterBody = {
  name: string;
  age?: number;
  email: string;
  password: string;
  repeatPassword: string;
};

export async function POST(req: NextRequest) {
  try {
    const { name, age, email, password, repeatPassword } =
      (await req.json()) as RegisterBody;

    if (!name || !email || !password || !repeatPassword) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }
    if (password !== repeatPassword) {
      return NextResponse.json(
        { error: "Passwords do not match" },
        { status: 400 },
      );
    }

    // Put name/age into user_metadata so you still capture it at signup
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp(
      {
        email,
        password,
        options: {
          data: { name, age },
        },
      },
    );

    if (signUpError) {
      return NextResponse.json({ error: signUpError.message }, { status: 400 });
    }

    const authUser = signUpData.user;

    // With the DB trigger, public.users row is auto-created. No app-side upsert/insert here.
    return NextResponse.json(
      {
        success: true,
        requiresEmailConfirm: !authUser,
        user: authUser ? { id: authUser.id, email: authUser.email } : null,
      },
      { status: 200 },
    );
  } catch (e: unknown) {
    let message = "Unexpected server error";
    if (e instanceof Error) message = e.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
