import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { isStaffEmail } from "./staff-allowlist";

type CookieList = { name: string; value: string; options?: CookieOptions }[];
import type { User } from "@supabase/supabase-js";

// Supabase Auth client for staff (server-side, cookie-based). Staff accounts are created in
// the Supabase dashboard; any authenticated user is treated as staff for this MVP.

export function getStaffClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) throw new Error("Supabase env vars missing.");
  const store = cookies();
  return createServerClient(url, anon, {
    cookies: {
      getAll() {
        return store.getAll();
      },
      setAll(list: CookieList) {
        try {
          list.forEach(({ name, value, options }) => store.set(name, value, options));
        } catch {
          /* called from a Server Component — cookie writes happen in middleware */
        }
      },
    },
  });
}

export async function getStaffUser(): Promise<User | null> {
  try {
    const { data } = await getStaffClient().auth.getUser();
    return data.user ?? null;
  } catch {
    return null;
  }
}

export async function requireStaff(): Promise<User> {
  const user = await getStaffUser();
  if (!user || !isStaffEmail(user.email)) redirect("/staff/login");
  return user;
}
