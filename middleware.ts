import { type NextRequest, NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { isStaffEmail } from "@/lib/configurator/staff-allowlist";

type CookieList = { name: string; value: string; options?: CookieOptions }[];

// Protect /staff/* (except the login page) behind a Supabase Auth session, and keep the
// session cookie fresh. Unauthenticated access redirects to /staff/login.
export async function middleware(req: NextRequest) {
  let res = NextResponse.next({ request: req });
  const path = req.nextUrl.pathname;
  const loginUrl = () => {
    const to = req.nextUrl.clone();
    to.pathname = "/staff/login";
    return to;
  };
  if (path === "/staff/login" || path === "/staff/login/") return res;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  // Fail closed: a protected route must not be reachable when auth config is absent.
  if (!url || !anon) return NextResponse.redirect(loginUrl());

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

  if (!user || !isStaffEmail(user.email)) {
    return NextResponse.redirect(loginUrl());
  }
  return res;
}

export const config = { matcher: ["/staff/:path*", "/status", "/map", "/map/:path*"] };
