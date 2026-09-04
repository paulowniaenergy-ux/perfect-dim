create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null default '',
  content text not null default '',
  cover_image_url text,
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists articles_public_feed_idx
  on public.articles (published, published_at desc, updated_at desc);

drop trigger if exists articles_set_updated_at on public.articles;
create trigger articles_set_updated_at
before update on public.articles
for each row execute function public.set_updated_at();

alter table public.articles enable row level security;
revoke all on table public.articles from anon, authenticated;
grant select on table public.articles to anon, authenticated;
grant insert, update, delete on table public.articles to authenticated;

create policy "Public can read published articles"
on public.articles for select to anon
using (published = true);

create policy "Authenticated can read published articles or admin rows"
on public.articles for select to authenticated
using (published = true or (select public.is_admin()));

create policy "Admins can insert articles"
on public.articles for insert to authenticated
with check ((select public.is_admin()));

create policy "Admins can update articles"
on public.articles for update to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy "Admins can delete articles"
on public.articles for delete to authenticated
using ((select public.is_admin()));
