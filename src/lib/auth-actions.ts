"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/home"); // Redirect to home after successful login
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  // Get form data - matching the SignupForm field names
  const name = formData.get("name") as string;
  const age = formData.get("age") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const repeatPassword = formData.get("repeatPassword") as string;

  // Validate passwords match
  if (password !== repeatPassword) {
    redirect("/error?message=Passwords do not match");
  }

  const data = {
    email,
    password,
    options: {
      data: {
        full_name: name,
        age: parseInt(age, 10),
        email,
      },
    },
  };

  const { error, data: authData } = await supabase.auth.signUp(data);

  if (error) {
    console.error("Signup error:", error);
    redirect("/error");
  }

  // ✅ FIXED: Check if email confirmation is required
  // If user needs to confirm email, redirect to confirmation page
  // Otherwise, they can access the app immediately
  const session = authData?.session;

  if (!session) {
    // No session means email confirmation is required
    redirect(`/signup-confirmation?email=${encodeURIComponent(email)}`);
  }

  // If there's a session, user can access immediately (email confirmation disabled)
  revalidatePath("/", "layout");
  redirect("/home");
}

export async function signout() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.log(error);
    redirect("/error");
  }

  redirect("/logout");
}

export async function signInWithGoogle() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) {
    console.log(error);
    redirect("/error");
  }

  redirect(data.url);
}
