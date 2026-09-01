import type { Metadata } from 'next';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { CatalogClient } from './catalog-client';
import { getPublishedProperties } from '@/lib/properties-repository';

export const metadata: Metadata = {
  title: 'Каталог будинків біля Луцька — Perfect Dim',
  description: 'Каталог будинків поблизу Луцька з фільтрами за ціною, площею, кімнатами, ділянкою та локацією.',
};

export const dynamic = 'force-dynamic';

export default async function CatalogPage() {
  const result = await getPublishedProperties();
  return <main><SiteHeader /><CatalogClient initialItems={result.ok ? result.data : []} unavailableMessage={result.ok ? '' : result.message} /><SiteFooter /></main>;
}
