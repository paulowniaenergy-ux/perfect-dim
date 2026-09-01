import type { Metadata } from 'next';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { CatalogClient } from './catalog-client';

export const metadata: Metadata = {
  title: 'Каталог будинків біля Луцька — Perfect Dim',
  description: 'Каталог будинків поблизу Луцька з фільтрами за ціною, площею, кімнатами, ділянкою та локацією.',
};

export default function CatalogPage() {
  return <main><SiteHeader /><CatalogClient /><SiteFooter /></main>;
}
