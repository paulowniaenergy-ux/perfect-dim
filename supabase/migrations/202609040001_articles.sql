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

insert into public.articles (slug, title, excerpt, content, published, published_at)
values
  ('yak-pereviryty-dilyanku-pered-budivnytstvom', 'Що перевірити на ділянці до старту будівництва', 'Список питань, які варто закрити до ескізу будинку: документи, під’їзд, мережі, рельєф і вода.', 'До вибору планування важливо перевірити цільове призначення ділянки та можливість підключення електрики, газу, води й каналізації. Не менш важливі ширина під’їзду, рівень ґрунтових вод, рельєф і місце для септика або свердловини.\n\nПопросіть технічні умови або уточніть фактичні точки підключення. Це дозволяє уникнути ситуації, коли бюджет на комунікації з’являється вже після затвердження проєкту.\n\nНа етапі посадки будинку варто одразу передбачити заїзд, парковку, терасу, відстані до меж і майбутнє озеленення.', true, now()),
  ('shcho-vhodyt-u-budynok-pid-kliuch', 'Що має бути зафіксовано в комплектації будинку «під ключ»', 'Фраза «під ключ» має сенс лише тоді, коли в ній є конкретний перелік робіт і матеріалів.', 'Порівнювати пропозиції потрібно не лише за площею та ціною. У комплектації мають бути окремо описані фундамент, матеріал стін, утеплення, покрівля, вікна, фасад, електрика, вода, опалення та вентиляція.\n\nЗапитайте, чи входять у вартість чорнові й чистові роботи, котел, тепла підлога, розводка сантехніки, бруківка, огорожа та підготовка території.\n\nЧим точніше це описано до старту, тим менше непередбачених доплат і різного трактування на будмайданчику.', true, now()),
  ('komunikatsii-budynku-shcho-zapytaty-u-zabudovnyka', 'Комунікації будинку: що запитати у забудовника', 'Короткий чекліст для розмови про електрику, воду, газ, каналізацію, інтернет і водовідведення.', 'Почніть з електрики: яка потужність заведена, де розташований щиток і чи передбачений резерв для зарядки авто або теплового насоса. По воді уточніть джерело, насосне обладнання й очищення.\n\nДля газу важливі точка підключення та склад котельні. Для каналізації — тип системи, обсяг і сервіс. Також варто дізнатися про оптичний інтернет, вуличне освітлення, дренаж і відведення дощової води.\n\nЦі деталі напряму впливають на комфорт проживання та витрати після отримання ключів.', true, now())
on conflict (slug) do nothing;
