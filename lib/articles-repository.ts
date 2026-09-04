import { getSupabaseConfig } from '@/lib/supabase/config';
import { createClient } from '@/lib/supabase/server';

export type Article = { id: string; slug: string; title: string; excerpt: string; content: string; coverImageUrl: string | null; published: boolean; publishedAt: string | null; createdAt: string; updatedAt: string };
export type ArticleRow = { id: string; slug: string; title: string; excerpt: string | null; content: string | null; cover_image_url: string | null; published: boolean; published_at: string | null; created_at: string; updated_at: string };
export type ArticleResult<T> = { ok: true; data: T } | { ok: false; message: string };

export function mapArticle(row: ArticleRow): Article { return { id: row.id, slug: row.slug, title: row.title, excerpt: row.excerpt ?? '', content: row.content ?? '', coverImageUrl: row.cover_image_url, published: row.published, publishedAt: row.published_at, createdAt: row.created_at, updatedAt: row.updated_at }; }

async function listArticles(admin = false): Promise<ArticleResult<Article[]>> {
  if (!getSupabaseConfig()) return { ok: false, message: 'Розділ статей ще не налаштований.' };
  try { const supabase = await createClient(); let query = supabase.from('articles').select('*').order('published_at', { ascending: false, nullsFirst: false }).order('updated_at', { ascending: false }); if (!admin) query = query.eq('published', true); const { data, error } = await query; if (error) throw error; return { ok: true, data: ((data ?? []) as ArticleRow[]).map(mapArticle) }; } catch (error) { return { ok: false, message: error instanceof Error ? error.message : 'Не вдалося завантажити статті.' }; }
}
export function getPublishedArticles() { return listArticles(); }
export function getAdminArticles() { return listArticles(true); }
export async function getPublishedArticleBySlug(slug: string): Promise<ArticleResult<Article | null>> { if (!getSupabaseConfig()) return { ok: false, message: 'Розділ статей ще не налаштований.' }; try { const supabase = await createClient(); const { data, error } = await supabase.from('articles').select('*').eq('published', true).eq('slug', slug).maybeSingle(); if (error) throw error; return { ok: true, data: data ? mapArticle(data as ArticleRow) : null }; } catch (error) { return { ok: false, message: error instanceof Error ? error.message : 'Не вдалося завантажити статтю.' }; } }
