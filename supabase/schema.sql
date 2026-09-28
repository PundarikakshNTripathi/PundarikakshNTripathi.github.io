-- Schema for the portfolio's blog. Run once in the Supabase SQL editor (steps in the README, "Writing posts").
-- Safe to re-run: every statement is idempotent.
--
-- Model
--   posts.draft      what the writer autosaves. Never visible to the public.
--   posts.published  the live version. Only changes when you press Publish / Update.
--   public_posts     the only thing anonymous readers can query: published fields, nothing else.
--
-- Who can write
--   Only users listed in blog_admins, and only after two-factor sign-in (JWT aal = 'aal2').

create extension if not exists pgcrypto;

-- Admins ---------------------------------------------------------------------------------------------
create table if not exists public.blog_admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  added_at timestamptz not null default now()
);
alter table public.blog_admins enable row level security;
revoke all on public.blog_admins from anon, authenticated;

-- True only for a listed admin who has completed MFA in this session.
create or replace function public.is_blog_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((auth.jwt() ->> 'aal') = 'aal2', false)
     and exists (select 1 from public.blog_admins a where a.user_id = auth.uid());
$$;
revoke all on function public.is_blog_admin() from public;
grant execute on function public.is_blog_admin() to authenticated;

-- Posts ----------------------------------------------------------------------------------------------
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and length(slug) <= 80),
  draft jsonb not null default '{}'::jsonb,
  published jsonb,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- Keeps a runaway paste from bloating the table; media lives in Storage, not inline.
  constraint draft_size check (pg_column_size(draft) < 2000000),
  constraint published_size check (published is null or pg_column_size(published) < 2000000)
);

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;
drop trigger if exists posts_touch on public.posts;
create trigger posts_touch before update on public.posts
for each row execute function public.touch_updated_at();

alter table public.posts enable row level security;
revoke all on public.posts from anon;

drop policy if exists "admins read posts" on public.posts;
drop policy if exists "admins insert posts" on public.posts;
drop policy if exists "admins update posts" on public.posts;
drop policy if exists "admins delete posts" on public.posts;
create policy "admins read posts" on public.posts for select to authenticated using (public.is_blog_admin());
create policy "admins insert posts" on public.posts for insert to authenticated with check (public.is_blog_admin());
create policy "admins update posts" on public.posts for update to authenticated using (public.is_blog_admin()) with check (public.is_blog_admin());
create policy "admins delete posts" on public.posts for delete to authenticated using (public.is_blog_admin());
grant select, insert, update, delete on public.posts to authenticated;

-- Public view: published fields only. Owned by postgres, so it reads past RLS, but it can only ever
-- return the published copy of published posts.
create or replace view public.public_posts as
  select id, slug, published, published_at
  from public.posts
  where published is not null and published_at is not null;
revoke all on public.public_posts from anon, authenticated;
grant select on public.public_posts to anon, authenticated;

-- Media ----------------------------------------------------------------------------------------------
-- Public bucket, raster images and video only (no SVG: an SVG file is a document that can run script),
-- 60 MB per file.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'blog-media', 'blog-media', true, 62914560,
  array['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/avif',
        'video/mp4', 'video/webm', 'video/ogg', 'video/quicktime']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "admins upload blog media" on storage.objects;
drop policy if exists "admins update blog media" on storage.objects;
drop policy if exists "admins delete blog media" on storage.objects;
create policy "admins upload blog media" on storage.objects for insert to authenticated
  with check (bucket_id = 'blog-media' and public.is_blog_admin());
create policy "admins update blog media" on storage.objects for update to authenticated
  using (bucket_id = 'blog-media' and public.is_blog_admin());
create policy "admins delete blog media" on storage.objects for delete to authenticated
  using (bucket_id = 'blog-media' and public.is_blog_admin());
-- Reading needs no policy: public buckets serve files by URL.
