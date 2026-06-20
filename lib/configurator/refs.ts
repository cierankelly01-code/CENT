import { createHash, randomBytes, timingSafeEqual } from "crypto";

// Reference codes + capability tokens for the build configurator.
//
// - `ref`   — human-readable, spoken on a call, shown in emails/quotes (e.g. "CEN-7K2Q4").
// - `token` — the capability secret embedded in the customer's link. We store only its
//             SHA-256 hash; the raw token exists only in the link/email. See spec §3.

// Unambiguous alphabet — no 0/O, 1/I/L to avoid mis-reads over the phone.
const REF_ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
const REF_LENGTH = 5;

/** A candidate ref like "CEN-7K2Q4". Uniqueness is enforced/retried at the DB layer. */
export function generateRefCandidate(): string {
  const bytes = randomBytes(REF_LENGTH);
  let body = "";
  for (let i = 0; i < REF_LENGTH; i++) {
    body += REF_ALPHABET[bytes[i] % REF_ALPHABET.length];
  }
  return `CEN-${body}`;
}

/** A high-entropy capability token (URL-safe). 256 bits. */
export function generateToken(): string {
  return randomBytes(32).toString("base64url");
}

/** SHA-256 hex of a token — what we persist in `access_token_hash`. */
export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/** Constant-time check that a presented token matches a stored hash. */
export function tokenMatches(token: string, expectedHash: string): boolean {
  if (!token || !expectedHash) return false;
  const actual = Buffer.from(hashToken(token), "hex");
  const expected = Buffer.from(expectedHash, "hex");
  if (actual.length !== expected.length) return false;
  return timingSafeEqual(actual, expected);
}
