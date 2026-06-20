-- Centaur Robotics — Phase 2 deep build configurator (System #2) schema.
-- Run this in the Supabase SQL editor (after the Phase 1 quote_requests table exists).
-- Spec: docs/PHASE-2-BUILD-CONFIGURATOR.md
--
-- Access model: these tables are NEVER readable/writable from the browser. All access
-- goes through server-side Route Handlers using the service-role key, scoped by a
-- capability token (see lib/configurator/types.ts + the spec §3). RLS is enabled with NO
-- anon/authenticated policies, so only the service role can touch the data.

-- ---------------------------------------------------------------------------
-- Live build record (one row per customer build).
-- ---------------------------------------------------------------------------
create table if not exists build_configs (
  id                uuid primary key default gen_random_uuid(),
  ref               text unique not null,          -- human code, e.g. "CEN-7K2Q4" (server-generated)
  access_token_hash text not null,                 -- sha-256 of the capability token; raw token only in the link
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),

  -- Optional link back to the marketing inquiry that started it.
  quote_request_id  uuid references quote_requests(id),

  -- Customer identity (captured/confirmed in the studio).
  customer_name     text,
  customer_email    text,
  customer_phone    text,

  -- Lifecycle (customer-facing portion; the ERP extends downstream).
  status            text not null default 'draft'
                    check (status in ('draft','submitted','under_review','quoted','confirmed','archived','abandoned')),

  -- The current specification. Structured, BOM-ready (see lib/configurator/types.ts).
  -- Default mirrors emptyBuildPayload() so rows are always contract-shaped, never bare {}.
  config_payload    jsonb not null default
    '{"schema_version":1,"selections":{},"multi":{},"freeText":{},"meta":{"completed_steps":[],"last_step":0}}'::jsonb,
  config_version    int  not null default 1,        -- mirrors the latest build_config_versions row

  submitted_at      timestamptz,

  -- UK GDPR consent record. Consent evidence must be complete when consent is given.
  consent_given     boolean not null default false,
  consent_at        timestamptz,
  consent_text      text,                           -- exact wording shown, for audit
  check (
    (consent_given = false)
    or (consent_given = true and consent_at is not null and consent_text is not null)
  )
);

create index if not exists build_configs_status_idx on build_configs (status);
create index if not exists build_configs_email_idx  on build_configs (customer_email);

-- ---------------------------------------------------------------------------
-- Append-only version history: a snapshot every time the spec is saved/submitted/edited.
-- "Customer changed their mind" = a new version; full history is kept.
-- ---------------------------------------------------------------------------
create table if not exists build_config_versions (
  id                uuid primary key default gen_random_uuid(),
  build_config_id   uuid not null references build_configs(id) on delete cascade,
  version           int  not null,
  config_payload    jsonb not null,
  created_at        timestamptz not null default now(),
  created_by        text not null default 'customer'
                    check (created_by in ('customer','staff','erp')),
  note              text,
  unique (build_config_id, version)
);

create index if not exists build_config_versions_parent_idx
  on build_config_versions (build_config_id, version desc);

-- ---------------------------------------------------------------------------
-- Light activity log (created, opened, autosaved, submitted, staff edited, status changed…).
-- ---------------------------------------------------------------------------
create table if not exists build_config_events (
  id                uuid primary key default gen_random_uuid(),
  build_config_id   uuid not null references build_configs(id) on delete cascade,
  created_at        timestamptz not null default now(),
  actor             text not null default 'customer',  -- 'customer' | 'staff:<email>' | 'system'
  event             text not null,                     -- 'created','opened','autosaved','submitted','status_changed','staff_edited'
  detail            jsonb
);

create index if not exists build_config_events_parent_idx
  on build_config_events (build_config_id, created_at desc);

-- ---------------------------------------------------------------------------
-- Enforce append-only history at the DB layer (defends against a server-side bug
-- rewriting audit history, even via the service role which bypasses RLS).
-- We block UPDATE only — DELETE is deliberately allowed so the `on delete cascade`
-- from build_configs still works for UK GDPR right-to-erasure.
-- ---------------------------------------------------------------------------
create or replace function prevent_update_on_append_only()
returns trigger language plpgsql as $$
begin
  raise exception 'append-only table %: UPDATE is not allowed', tg_table_name;
end;
$$;

drop trigger if exists build_config_versions_no_update on build_config_versions;
create trigger build_config_versions_no_update
  before update on build_config_versions
  for each row execute function prevent_update_on_append_only();

drop trigger if exists build_config_events_no_update on build_config_events;
create trigger build_config_events_no_update
  before update on build_config_events
  for each row execute function prevent_update_on_append_only();

-- ---------------------------------------------------------------------------
-- Keep updated_at fresh on every write to build_configs.
-- ---------------------------------------------------------------------------
create or replace function set_build_configs_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists build_configs_set_updated_at on build_configs;
create trigger build_configs_set_updated_at
  before update on build_configs
  for each row execute function set_build_configs_updated_at();

-- ---------------------------------------------------------------------------
-- Atomic submit: compute the next snapshot version, write the immutable version row, and
-- flip the live row to 'submitted' (with consent) — all in one transaction. The plpgsql
-- function body runs atomically, so a partial failure can't leave an orphan snapshot or a
-- stale live row. Called from the server via supabase.rpc('submit_build', …).
-- Guards on status = 'draft' so a build can only be submitted once.
-- ---------------------------------------------------------------------------
create or replace function submit_build(
  p_build_id       uuid,
  p_payload        jsonb,
  p_consent_text   text,
  p_customer_name  text,
  p_customer_email text,
  p_customer_phone text
)
returns build_configs
language plpgsql as $$
declare
  v_next int;
  v_row  build_configs;
begin
  select coalesce(max(version), 0) + 1 into v_next
    from build_config_versions
    where build_config_id = p_build_id;

  insert into build_config_versions (build_config_id, version, config_payload, created_by, note)
  values (p_build_id, v_next, p_payload, 'customer', 'Customer submission');

  update build_configs set
    status         = 'submitted',
    submitted_at   = now(),
    consent_given  = true,
    consent_at     = now(),
    consent_text   = p_consent_text,
    config_payload = p_payload,
    config_version = v_next,
    customer_email = p_customer_email,
    customer_name  = p_customer_name,
    customer_phone = p_customer_phone
  where id = p_build_id and status = 'draft'
  returning * into v_row;

  if v_row.id is null then
    raise exception 'build % is not in draft status', p_build_id;
  end if;

  return v_row;
end;
$$;

-- ---------------------------------------------------------------------------
-- Row Level Security: lock all three tables to the browser entirely.
-- Enabled with NO anon/authenticated policies → only the service-role key (used by our
-- server-side Route Handlers) can read/write. Staff read/write arrives later as
-- authenticated policies scoped to staff (Supabase Auth), per docs/PHASE-2-OPS.md.
-- ---------------------------------------------------------------------------
alter table build_configs         enable row level security;
alter table build_config_versions enable row level security;
alter table build_config_events   enable row level security;
