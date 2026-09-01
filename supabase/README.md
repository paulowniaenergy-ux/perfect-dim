# Supabase для Perfect Dim

Цей каталог містить SQL, потрібний для підключення production-застосунку без
`service_role` ключа та без пароля бази даних.

## Файли

- `migrations/202609010001_initial_properties.sql` — таблиці, індекси, RLS,
  Storage bucket і Storage policies.
- `seed.sql` — ідемпотентне перенесення 20 демонстраційних об’єктів. Файл не
  видаляє наявних записів та не додає фотографій у GitHub.
- `verify.sql` — безпечні перевірки після виконання migration і seed.

## Модель доступу

- `anon` бачить тільки `properties.published = true` та метадані фотографій
  опублікованих об’єктів.
- Користувач `authenticated` отримує права запису лише тоді, коли його UUID є в
  `public.admin_users`.
- Bucket `property-images` є public: браузер і пошукові роботи отримують сталі
  CDN URL без генерації signed URL. Завантаження, список, зміна й видалення
  об’єктів Storage дозволені тільки адміністратору через RLS.
- Файл чернетки технічно доступний тому, хто вже знає його випадковий URL. Тому
  шлях містить UUID об’єкта та випадковий UUID файлу, а метадані чернеток не
  видаються публічно. Для цього сайту це свідомий компроміс на користь швидкої,
  кешованої та SEO-friendly видачі опублікованих фото.

## Створення першого адміністратора

Після створення користувача вручну в Supabase Auth виконайте в SQL Editor,
підставивши його email:

```sql
insert into public.admin_users (user_id)
select id
from auth.users
where lower(email) = lower('ADMIN_EMAIL_HERE')
on conflict (user_id) do nothing;
```

Публічної форми реєстрації в застосунку немає. У Supabase також слід вимкнути
дозвіл на нові реєстрації в налаштуваннях Auth.

## Environment variables

Застосунок використовує тільки браузерно-безпечні значення:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
NEXT_PUBLIC_SITE_URL
```

`service_role`, database password та JWT secret застосунку не потрібні.
