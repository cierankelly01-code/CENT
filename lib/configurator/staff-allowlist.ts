// Optional staff email allowlist. When STAFF_ALLOWED_EMAILS is set (comma-separated),
// only those addresses are treated as staff; otherwise any authenticated Supabase user
// is staff for this MVP (accounts are created manually in the dashboard, so the pool is
// already closed). Shared by the server auth gate and the edge middleware so both apply
// the same predicate. Safe in both runtimes — no Node/server-only imports.
export function isStaffEmail(email: string | null | undefined): boolean {
  const allow = (process.env.STAFF_ALLOWED_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  if (allow.length === 0) return true;
  return !!email && allow.includes(email.toLowerCase());
}
