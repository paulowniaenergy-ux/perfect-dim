-- Запустіть після migration і seed у Supabase SQL Editor.
-- Скрипт лише читає конфігурацію та дані.

select
  (select count(*) from public.properties) as properties_count,
  (select count(*) from public.properties where published) as published_count,
  (select count(*) from public.properties where status = 'sold') as sold_count,
  (select count(*) from public.property_images) as images_count;

select id, public, file_size_limit, allowed_mime_types
from storage.buckets
where id = 'property-images';

select schemaname, tablename, policyname, roles, cmd
from pg_policies
where (schemaname = 'public' and tablename in ('admin_users', 'properties', 'property_images'))
   or (schemaname = 'storage' and tablename = 'objects')
order by schemaname, tablename, policyname;
