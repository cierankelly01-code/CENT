"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { EnquirySummary } from "@/lib/admin/orders";
import StatusBadge from "@/components/staff/StatusBadge";
import { humanizeStatus } from "@/lib/staff-format";

// Client-side search + status filter over the enquiries list. (Status options are derived
// from the rows so this stays a pure client component — no server-only import.)
export default function EnquiriesTable({ rows }: { rows: EnquirySummary[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");

  const statuses = useMemo(
    () => Array.from(new Set(rows.map((r) => r.status))).sort(),
    [rows]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (status !== "all" && r.status !== status) return false;
      if (!q) return true;
      return `${r.name} ${r.email}`.toLowerCase().includes(q);
    });
  }, [rows, query, status]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name or email"
          aria-label="Search enquiries"
          className="min-w-0 flex-1 rounded-md border border-mist bg-bone px-3 py-2 font-sans text-sm text-ink"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          aria-label="Filter by status"
          className="rounded-md border border-mist bg-bone px-3 py-2 font-sans text-sm text-ink"
        >
          <option value="all">All statuses</option>
          {statuses.map((s) => (
            <option key={s} value={s}>
              {humanizeStatus(s)}
            </option>
          ))}
        </select>
      </div>

      <p className="mt-3 font-sans text-sm text-ink/60" aria-live="polite">
        {filtered.length} of {rows.length} shown
      </p>

      {filtered.length === 0 ? (
        <p className="mt-6 font-sans text-base text-ink/70">No matching enquiries.</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-left font-sans text-sm">
            <thead>
              <tr className="border-b border-mist text-ink/70">
                <th scope="col" className="py-3 pr-4 font-medium">Name</th>
                <th scope="col" className="py-3 pr-4 font-medium">Email</th>
                <th scope="col" className="py-3 pr-4 font-medium">Type</th>
                <th scope="col" className="py-3 pr-4 font-medium">Status</th>
                <th scope="col" className="py-3 pr-4 font-medium">Received</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => (
                <tr key={e.id} className="border-b border-mist/60">
                  <td className="py-3 pr-4">
                    <Link
                      href={`/staff/enquiries/${e.id}`}
                      className="font-medium text-bronze-deep underline underline-offset-2 hover:text-ink"
                    >
                      {e.name}
                    </Link>
                  </td>
                  <td className="py-3 pr-4 text-ink/80">{e.email}</td>
                  <td className="py-3 pr-4 text-ink/80 capitalize">{e.enquiry_type}</td>
                  <td className="py-3 pr-4"><StatusBadge status={e.status} /></td>
                  <td className="py-3 pr-4 text-ink/70">
                    {/* Fixed UTC so server prerender and client hydration agree. */}
                    {new Date(e.created_at).toLocaleString("en-GB", { timeZone: "UTC" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
