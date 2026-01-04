import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: "",
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Check if guest mode is active by looking for the guest mode cookie
  const guestModeCookie = request.cookies.get("sifthr_guest_mode_active");
  const isGuestMode = guestModeCookie?.value === "true";

  // If user is authenticated and trying to access the landing page, redirect to /home
  if (user && request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  // Protected routes that require authentication (unless in guest mode)
  const protectedRoutes = ["/home", "/profile", "/settings", "/admin"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route),
  );

  // Special routes that only authenticated users can access (not guests)
  const authOnlyRoutes = ["/profile", "/admin"];
  const isAuthOnlyRoute = authOnlyRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route),
  );

  // Block unauthenticated non-guests from protected routes
  if (!user && !isGuestMode && isProtectedRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Block guests from auth-only routes, redirect to guest profile
  if (!user && isGuestMode && isAuthOnlyRoute) {
    return NextResponse.redirect(new URL("/guest-profile", request.url));
  }

  return response;
}
