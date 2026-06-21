// Small presentational helpers for the staff panel. Pure (no server-only imports) so both
// server and client components can use them.

/** "under_review" -> "Under review", "test_drive" -> "Test drive". */
export function humanizeStatus(s: string): string {
  const spaced = s.replace(/_/g, " ");
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}
