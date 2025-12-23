import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies
            .getAll()
            .map(({ name, value }) => ({ name, value }));
        },
        setAll(cookies) {
          cookies.forEach(({ name, value, options }) => {
            res.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const { data } = await supabase.auth.getSession();
  const session = data.session;
  const { pathname, origin } = req.nextUrl;

  // If user hits the landing page "/" and has a session, send to /home
  if (pathname === "/" && session) {
    return NextResponse.redirect(new URL("/home", origin));
  }

  // Optionally: protect certain paths
  // const protectedPrefixes = ["/profile", "/camera", "/dashboard"];
  // if (protectedPrefixes.some((p) => pathname.startsWith(p)) && !session) {
  //   const url = new URL("/", origin);
  //   url.searchParams.set("redirectTo", pathname);
  //   return NextResponse.redirect(url);
  // }

  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|oldFavicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
