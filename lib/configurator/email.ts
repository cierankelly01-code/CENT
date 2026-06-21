import "server-only";

// Transactional email via Resend (REST, no SDK dependency). No-ops without RESEND_API_KEY so
// submit still works before email is configured. From: hello@centaurrobotics.com — TBC until
// the domain is verified, so defaults to Resend's test sender until RESEND_FROM is set.

const FROM = process.env.RESEND_FROM || "Centaur Robotics <onboarding@resend.dev>";
const STAFF = process.env.STAFF_NOTIFY_EMAIL || "hello@centaurrobotics.com";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

type EmailPayload = { from: string; to: string[]; subject: string; html: string; text: string };

async function send(payload: EmailPayload): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    // eslint-disable-next-line no-console
    console.info("RESEND_API_KEY not set — skipping email:", payload.subject);
    return;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      // eslint-disable-next-line no-console
      console.error("resend send failed:", res.status, await res.text().catch(() => ""));
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("resend send error:", err);
  }
}

export type SubmissionEmailInput = {
  ref: string;
  customerName: string | null;
  customerEmail: string;
  resumeUrl?: string | null;
};

/** Customer confirmation + staff notification on submit. Best-effort (never throws). */
export async function sendSubmissionEmails(input: SubmissionEmailInput): Promise<void> {
  const first = input.customerName?.trim().split(/\s+/)[0] || "there";
  const linkHtml = input.resumeUrl
    ? `<p>You can revisit your build here: <a href="${escapeHtml(input.resumeUrl)}">${escapeHtml(input.resumeUrl)}</a></p>`
    : "";
  const linkText = input.resumeUrl ? `\nRevisit your build: ${input.resumeUrl}\n` : "";

  await Promise.all([
    send({
      from: FROM,
      to: [input.customerEmail],
      subject: `Your Centaur build — ${input.ref}`,
      html: `<p>Hi ${escapeHtml(first)},</p><p>Thank you — we’ve received your Centaur specification under reference <strong>${escapeHtml(input.ref)}</strong>. A member of our team will be in touch to talk it through, prepare a tailored quote and arrange a test drive.</p>${linkHtml}<p>— Centaur Robotics</p>`,
      text: `Hi ${first},\n\nThank you — we’ve received your Centaur specification under reference ${input.ref}. A member of our team will be in touch to talk it through, prepare a tailored quote and arrange a test drive.\n${linkText}\n— Centaur Robotics`,
    }),
    send({
      from: FROM,
      to: [STAFF],
      subject: `New Centaur build submitted — ${input.ref}`,
      html: `<p>A new build was submitted.</p><ul><li>Reference: ${escapeHtml(input.ref)}</li><li>Name: ${escapeHtml(input.customerName || "—")}</li><li>Email: ${escapeHtml(input.customerEmail)}</li></ul>`,
      text: `A new build was submitted.\nReference: ${input.ref}\nName: ${input.customerName || "—"}\nEmail: ${input.customerEmail}`,
    }),
  ]);
}
