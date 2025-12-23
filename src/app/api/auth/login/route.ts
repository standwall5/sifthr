import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabaseClient";

type LoginBody = {
  email: string;
  password: string;
};

export async function POST(req: NextRequest) {
  try {
    const { email, password } = (await req.json()) as LoginBody;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    // Do not upsert into public.users here. The trigger already created the row at signup.
    // If you want to update fields later, do a targeted UPDATE with eq('auth_id', user.id)
    // and ensure the users_update_self policy exists.

    return NextResponse.json(
      {
        success: true,
        user: { id: data.user?.id, email: data.user?.email },
        session: data.session,
      },
      { status: 200 },
    );
  } catch (e: unknown) {
    let message = "Unexpected server error";
    if (e instanceof Error) message = e.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
