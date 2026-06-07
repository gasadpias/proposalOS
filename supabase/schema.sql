-- ===========================================================================
-- ProposalOS — Database Schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query).
-- It is idempotent-ish: safe to run once on a fresh project.
-- All four tables are created now so you don't need to re-migrate in later
-- phases. Phase 1 only USES the `projects` table.
-- ===========================================================================

-- Needed for gen_random_uuid()
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- projects
-- ---------------------------------------------------------------------------
create table if not exists public.projects (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references auth.users(id) on delete cascade,
  name                text not null,
  client_name         text,
  industry            text,
  country             text,
  proposal_type       text,
  submission_deadline date,
  notes               text,
  status              text not null default 'draft',
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index if not exists projects_user_id_idx on public.projects(user_id);
create index if not exists projects_created_at_idx on public.projects(created_at desc);

-- ---------------------------------------------------------------------------
-- documents  (used from Phase 2 onward)
-- ---------------------------------------------------------------------------
create table if not exists public.documents (
  id             uuid primary key default gen_random_uuid(),
  project_id     uuid not null references public.projects(id) on delete cascade,
  user_id        uuid not null references auth.users(id) on delete cascade,
  file_name      text not null,
  file_type      text,
  storage_path   text,
  extracted_text text,
  status         text not null default 'uploaded',
  created_at     timestamptz not null default now()
);

create index if not exists documents_project_id_idx on public.documents(project_id);
create index if not exists documents_user_id_idx on public.documents(user_id);

-- ---------------------------------------------------------------------------
-- analyses  (used from Phase 3 onward)
-- ---------------------------------------------------------------------------
create table if not exists public.analyses (
  id                     uuid primary key default gen_random_uuid(),
  project_id             uuid not null references public.projects(id) on delete cascade,
  document_id            uuid references public.documents(id) on delete set null,
  user_id                uuid not null references auth.users(id) on delete cascade,
  rfp_summary            jsonb,
  requirement_matrix     jsonb,
  compliance_matrix      jsonb,
  clarification_questions jsonb,
  risk_register          jsonb,
  assumptions            jsonb,
  dependencies           jsonb,
  proposal_outline       jsonb,
  executive_summary      text,
  full_proposal_draft    text,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

create index if not exists analyses_project_id_idx on public.analyses(project_id);
create index if not exists analyses_user_id_idx on public.analyses(user_id);

-- ---------------------------------------------------------------------------
-- exports  (used from the export phase onward)
-- ---------------------------------------------------------------------------
create table if not exists public.exports (
  id           uuid primary key default gen_random_uuid(),
  project_id   uuid not null references public.projects(id) on delete cascade,
  user_id      uuid not null references auth.users(id) on delete cascade,
  export_type  text not null,
  storage_path text,
  created_at   timestamptz not null default now()
);

create index if not exists exports_project_id_idx on public.exports(project_id);
create index if not exists exports_user_id_idx on public.exports(user_id);

-- ---------------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

drop trigger if exists analyses_set_updated_at on public.analyses;
create trigger analyses_set_updated_at
  before update on public.analyses
  for each row execute function public.set_updated_at();

-- ===========================================================================
-- Row Level Security — each user can only see and touch their own rows.
-- ===========================================================================
alter table public.projects  enable row level security;
alter table public.documents enable row level security;
alter table public.analyses  enable row level security;
alter table public.exports   enable row level security;

-- projects
drop policy if exists "projects_select_own" on public.projects;
create policy "projects_select_own" on public.projects
  for select using (auth.uid() = user_id);

drop policy if exists "projects_insert_own" on public.projects;
create policy "projects_insert_own" on public.projects
  for insert with check (auth.uid() = user_id);

drop policy if exists "projects_update_own" on public.projects;
create policy "projects_update_own" on public.projects
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "projects_delete_own" on public.projects;
create policy "projects_delete_own" on public.projects
  for delete using (auth.uid() = user_id);

-- documents
drop policy if exists "documents_all_own" on public.documents;
create policy "documents_all_own" on public.documents
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- analyses
drop policy if exists "analyses_all_own" on public.analyses;
create policy "analyses_all_own" on public.analyses
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- exports
drop policy if exists "exports_all_own" on public.exports;
create policy "exports_all_own" on public.exports
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
