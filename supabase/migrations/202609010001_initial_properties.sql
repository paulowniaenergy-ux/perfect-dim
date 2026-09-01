create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null default '',
  price numeric(14, 2) not null check (price >= 0),
  currency char(3) not null default 'USD' check (currency = upper(currency)),
  property_type text not null default 'house',
  transaction_type text not null default 'sale',
  status text not null default 'available' check (status in ('available', 'reserved', 'sold')),
  city text not null,
  address text,
  latitude numeric(9, 6) check (latitude between -90 and 90),
  longitude numeric(9, 6) check (longitude between -180 and 180),
  area numeric(10, 2) not null check (area >= 0),
  land_area numeric(10, 2) not null default 0 check (land_area >= 0),
  bedrooms smallint check (bedrooms >= 0),
  bathrooms smallint check (bathrooms >= 0),
  rooms smallint not null default 0 check (rooms >= 0),
  floors smallint check (floors > 0),
  year_built smallint check (year_built between 1800 and 2200),
  distance_to_lutsk_km numeric(8, 2) check (distance_to_lutsk_km >= 0),
  featured boolean not null default false,
  published boolean not null default false,
  highlights text[] not null default '{}',
  attributes jsonb not null default '{}'::jsonb check (jsonb_typeof(attributes) = 'object'),
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.property_images (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  storage_path text not null unique,
  alt_text text not null default '',
  sort_order integer not null default 0 check (sort_order >= 0),
  is_cover boolean not null default false,
  created_at timestamptz not null default now()
);

create unique index if not exists property_images_one_cover_idx
  on public.property_images(property_id)
  where is_cover = true;
create index if not exists property_images_property_sort_idx
  on public.property_images(property_id, sort_order);
create index if not exists properties_public_catalog_idx
  on public.properties(published, featured, status, updated_at desc);
create index if not exists properties_city_idx on public.properties(city);
create index if not exists properties_price_idx on public.properties(price);
create index if not exists properties_area_idx on public.properties(area);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists properties_set_updated_at on public.properties;
create trigger properties_set_updated_at
before update on public.properties
for each row execute function public.set_updated_at();

alter table public.admin_users enable row level security;
alter table public.properties enable row level security;
alter table public.property_images enable row level security;

revoke all on table public.admin_users from anon, authenticated;
revoke all on table public.properties from anon, authenticated;
revoke all on table public.property_images from anon, authenticated;

grant select on table public.properties to anon, authenticated;
grant select on table public.property_images to anon, authenticated;
grant insert, update, delete on table public.properties to authenticated;
grant insert, update, delete on table public.property_images to authenticated;

drop policy if exists "Public can read published properties" on public.properties;
create policy "Public can read published properties"
on public.properties for select to anon
using (published = true);

drop policy if exists "Authenticated can read published properties or admin rows" on public.properties;
create policy "Authenticated can read published properties or admin rows"
on public.properties for select to authenticated
using (published = true or (select public.is_admin()));

drop policy if exists "Admins can insert properties" on public.properties;
create policy "Admins can insert properties"
on public.properties for insert to authenticated
with check ((select public.is_admin()));

drop policy if exists "Admins can update properties" on public.properties;
create policy "Admins can update properties"
on public.properties for update to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

drop policy if exists "Admins can delete properties" on public.properties;
create policy "Admins can delete properties"
on public.properties for delete to authenticated
using ((select public.is_admin()));

drop policy if exists "Public can read images of published properties" on public.property_images;
create policy "Public can read images of published properties"
on public.property_images for select to anon
using (
  exists (
    select 1 from public.properties
    where properties.id = property_images.property_id
      and properties.published = true
  )
);

drop policy if exists "Authenticated can read allowed property images" on public.property_images;
create policy "Authenticated can read allowed property images"
on public.property_images for select to authenticated
using (
  (select public.is_admin())
  or exists (
    select 1 from public.properties
    where properties.id = property_images.property_id
      and properties.published = true
  )
);

drop policy if exists "Admins can insert property images" on public.property_images;
create policy "Admins can insert property images"
on public.property_images for insert to authenticated
with check ((select public.is_admin()));

drop policy if exists "Admins can update property images" on public.property_images;
create policy "Admins can update property images"
on public.property_images for update to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

drop policy if exists "Admins can delete property images" on public.property_images;
create policy "Admins can delete property images"
on public.property_images for delete to authenticated
using ((select public.is_admin()));

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'property-images',
  'property-images',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Admins can list property storage" on storage.objects;
create policy "Admins can list property storage"
on storage.objects for select to authenticated
using (
  bucket_id = 'property-images'
  and (select public.is_admin())
);

drop policy if exists "Admins can upload property storage" on storage.objects;
create policy "Admins can upload property storage"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'property-images'
  and (select public.is_admin())
  and lower(storage.extension(name)) = any (array['jpg', 'jpeg', 'png', 'webp', 'avif'])
);

drop policy if exists "Admins can update property storage" on storage.objects;
create policy "Admins can update property storage"
on storage.objects for update to authenticated
using (
  bucket_id = 'property-images'
  and (select public.is_admin())
)
with check (
  bucket_id = 'property-images'
  and (select public.is_admin())
  and lower(storage.extension(name)) = any (array['jpg', 'jpeg', 'png', 'webp', 'avif'])
);

drop policy if exists "Admins can delete property storage" on storage.objects;
create policy "Admins can delete property storage"
on storage.objects for delete to authenticated
using (
  bucket_id = 'property-images'
  and (select public.is_admin())
);
