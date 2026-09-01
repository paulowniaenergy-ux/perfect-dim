import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getSupabaseConfig } from '@/lib/supabase/config';
import { createClient } from '@/lib/supabase/server';
import { getAdminProperties } from '@/lib/properties-repository';
import { AdminClient } from './admin-client';

export const metadata: Metadata = { title: 'Адмінка — Perfect Dim', robots: { index: false, follow: false } };

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  if (!getSupabaseConfig()) return <AdminConfigurationNotice />;

  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  if (!claimsData?.claims) redirect('/admin/login');

  const { data: isAdmin, error: adminError } = await supabase.rpc('is_admin');
  if (adminError || !isAdmin) redirect('/admin/login?error=forbidden');

  const result = await getAdminProperties();
  return <AdminClient initialItems={result.ok ? result.data : []} initialError={result.ok ? '' : result.message} adminEmail={String(claimsData.claims.email ?? '')} />;
}

function AdminConfigurationNotice() {
  return <main className="grid min-h-screen place-items-center bg-[#eef0e8] px-5 text-center text-[#173326]"><div className="max-w-xl bg-[#f8f4ec] p-8 sm:p-12"><p className="pd-eyebrow">Perfect Dim</p><h1 className="mt-4 text-4xl">Адмінка очікує підключення Supabase</h1><p className="mt-5 leading-7 text-[#647368]">Додайте URL проєкту та Publishable key у environment variables. Жодних секретних або service-role ключів ця сторінка не потребує.</p><a href="/" className="mt-7 inline-flex h-12 items-center bg-[#173326] px-6 text-sm font-semibold text-white">Повернутися на сайт</a></div></main>;
}
