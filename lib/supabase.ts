import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Lazily-validated singleton. We avoid throwing at import time so the page still
// renders during local setup before env vars are present; the form surfaces a
// graceful error instead.
export function getSupabaseClient() {
  if (!url || !anonKey) {
    throw new Error(
      "Supabase env vars missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }
  return createClient(url, anonKey);
}

export type QuoteRequestInsert = {
  name: string;
  email: string;
  phone: string | null;
  enquiry_type: "personal" | "business";
  message: string | null;
};
