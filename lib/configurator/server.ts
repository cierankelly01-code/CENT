import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Service-role Supabase client for the build configurator's server boundary.
//
// SECURITY: this uses SUPABASE_SERVICE_ROLE_KEY, which BYPASSES Row Level Security.
// It must NEVER be imported into a Client Component or shipped to the browser. The
// `server-only` import above makes a client-side import a build error. All build-config
// table access goes through here, gated by capability-token checks (see repository.ts).

let cached: SupabaseClient | null = null;

export function getServiceClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error(
      "Supabase server env vars missing. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
  }
  if (!cached) {
    cached = createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return cached;
}
