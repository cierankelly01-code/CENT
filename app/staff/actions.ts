"use server";

import { revalidatePath } from "next/cache";
import { requireStaff } from "@/lib/configurator/staff-auth";
import { createDraft, staffUpdateBuildStatus } from "@/lib/configurator/repository";
import { staffUpdateEnquiryStatus } from "@/lib/admin/orders";

// Staff-only server actions. Each re-checks requireStaff() — never trust the caller.

function siteBase(): string {
  // Canonical public origin for customer links. Must be set in Vercel — fail fast rather
  // than silently generating a link on the wrong (or cert-broken) domain.
  const base = process.env.NEXT_PUBLIC_SITE_URL;
  if (!base) throw new Error("NEXT_PUBLIC_SITE_URL is not set — cannot build a customer link.");
  return base.replace(/\/$/, "");
}

/** Create a fresh build draft and return the private link to send the customer. */
export async function generateBuildLink(): Promise<{ ref: string; url: string }> {
  await requireStaff();
  const created = await createDraft({});
  return { ref: created.ref, url: `${siteBase()}/build/${created.ref}?t=${created.token}` };
}

export async function setEnquiryStatus(id: string, status: string): Promise<void> {
  await requireStaff();
  const ok = await staffUpdateEnquiryStatus(id, status);
  if (!ok) throw new Error("Enquiry not found.");
  revalidatePath(`/staff/enquiries/${id}`);
  revalidatePath("/staff/enquiries");
  revalidatePath("/staff");
}

export async function setBuildStatus(ref: string, status: string): Promise<void> {
  await requireStaff();
  const ok = await staffUpdateBuildStatus(ref, status);
  if (!ok) throw new Error("Build not found.");
  revalidatePath(`/staff/builds/${ref}`);
  revalidatePath("/staff/builds");
}
