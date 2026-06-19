-- Centaur Robotics — Phase 1 lead capture schema.
-- Run this in the Supabase SQL editor.

create table quote_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  name text not null,
  email text not null,
  phone text,
  enquiry_type text check (enquiry_type in ('personal','business')) not null,
  message text,
  status text default 'new',          -- lifecycle hook for later
  config_payload jsonb                 -- RESERVED: Phase 2 configurator writes the spec here
);

-- Row Level Security: anon may insert leads, nobody may read them from the browser.
alter table quote_requests enable row level security;

create policy "anon can insert leads"
on quote_requests for insert to anon
with check (true);
-- Deliberately NO select policy for anon: nobody can read leads from the browser.
-- You read leads in the Supabase dashboard (or a future authed admin view in Phase 2).
