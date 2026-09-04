import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getAdminArticles } from '@/lib/articles-repository';
import { ArticlesAdminClient } from './articles-admin-client';
export const dynamic = 'force-dynamic';
export default async function ArticlesAdminPage() { const supabase = await createClient(); const { data: claims } = await supabase.auth.getClaims(); if (!claims?.claims) redirect('/admin/login'); const { data: admin } = await supabase.rpc('is_admin'); if (!admin) redirect('/admin/login?error=forbidden'); const result = await getAdminArticles(); return <ArticlesAdminClient initialItems={result.ok ? result.data : []} initialError={result.ok ? '' : result.message} />; }
