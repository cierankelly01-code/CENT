import { type NextRequest, NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

type CookieList = { name: string; value: string; options?: CookieOptions }[];

// Protect /staff/* (except the login page) behind a Supabase Auth session, and keep the
// session cookie fresh. Unauthenticated access redirects to /staff/login.
export async function middleware(req: NextRequest) {
  let res = NextResponse.next({ request: req });
  const path = req.nextUrl.pathname;
  if (path.startsWith("/staff/login")) return res;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return res;

  const supabase = createServerClient(url, anon, {
    cookies: {
      getAll() {
        return req.cookies.getAll();
      },
      setAll(list: CookieList) {
        list.forEach(({ name, value }) => req.cookies.set(name, value));
        res = NextResponse.next({ request: req });
        list.forEach(({ name, value, options }) => res.cookies.set(name, value, options));
      },
    },
  });

  let user = null;
  try {
    user = (await supabase.auth.getUser()).data.user;
  } catch {
    user = null;
  }

  if (!user) {
    const to = req.nextUrl.clone();
    to.pathname = "/staff/login";
    return NextResponse.redirect(to);
  }
  return res;
}

export const config = { matcher: ["/staff/:path*"] };
