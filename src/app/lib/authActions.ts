import { supabase } from "@/app/lib/supabaseClient";
import type { AuthError } from "@supabase/supabase-js";

type AuthResult = {
  success: boolean;
  error?: string;
  isAdmin?: boolean;
};

/**
 * Sign in a user and fetch their admin status
 */
export async function signInUser(
  email: string,
  password: string,
): Promise<AuthResult> {
  // Sign in with Supabase
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      success: false,
      error: handleAuthError(error),
    };
  }

  // Fetch and cache admin status
  if (data.user) {
    const isAdmin = await fetchAndCacheAdminStatus(data.user.id);
    return {
      success: true,
      isAdmin,
    };
  }

  return { success: false, error: "Login failed. Please try again." };
}

/**
 * Sign up a new user and fetch their admin status
 */
export async function signUpUser(
  email: string,
  password: string,
  name: string,
  age: number,
): Promise<AuthResult> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name, age },
    },
  });

  if (error) {
    return {
      success: false,
      error: handleAuthError(error),
    };
  }

  if (data.user) {
    const isAdmin = await fetchAndCacheAdminStatus(data.user.id);
    return {
      success: true,
      isAdmin,
    };
  }

  return {
    success: false,
    error: "Please check your email to confirm your account.",
  };
}

/**
 * Sign out the current user and clear cached data
 */
export async function signOutUser(): Promise<void> {
  // Clear cached admin status
  if (typeof window !== "undefined") {
    sessionStorage.removeItem("user_is_admin");
    sessionStorage.removeItem("user_auth_id");
  }

  // Sign out from Supabase
  await supabase.auth.signOut();
}

/**
 * Fetch admin status from database and cache it
 */
export async function fetchAndCacheAdminStatus(
  authId: string,
): Promise<boolean> {
  const { data, error } = await supabase
    .from("users")
    .select("is_admin")
    .eq("auth_id", authId)
    .maybeSingle();

  const isAdmin = !error && data ? Boolean(data.is_admin) : false;

  // Cache in sessionStorage for immediate access
  if (typeof window !== "undefined") {
    sessionStorage.setItem("user_is_admin", String(isAdmin));
    sessionStorage.setItem("user_auth_id", authId);
  }

  return isAdmin;
}

/**
 * Get cached admin status (returns immediately without async call)
 */
export function getCachedAdminStatus(): boolean | null {
  if (typeof window === "undefined") return null;

  const cached = sessionStorage.getItem("user_is_admin");
  return cached !== null ? cached === "true" : null;
}

/**
 * Handle Supabase auth errors and return user-friendly messages
 */
function handleAuthError(error: AuthError): string {
  switch (error.code) {
    case "email_not_confirmed":
      return "Email not confirmed. Please check your inbox.";
    case "invalid_credentials":
      return "Invalid email or password.";
    case "user_already_exists":
      return "An account with this email already exists.";
    case "weak_password":
      return "Password is too weak. Please use a stronger password.";
    default:
      return error.message || "An error occurred. Please try again.";
  }
}
