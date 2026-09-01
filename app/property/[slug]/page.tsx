import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { coverImage } from '@/lib/property-types';
import { getPublishedPropertyBySlug } from '@/lib/properties-repository';
import { PropertyDetailClient } from './property-detail-client';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const result = await getPublishedPropertyBySlug(slug);
  if (!result.ok || !result.data) return { title: 'Об’єкт не знайдено — Perfect Dim' };
  const property = result.data;
  const title = `${property.title}, ${property.location} — Perfect Dim`;
  const description = `Будинок ${property.houseArea} м², ділянка ${property.landArea} соток, ${property.rooms} кімнат. ${property.location}, біля Луцька.`;
  const image = coverImage(property)?.url;
  return { title, description, openGraph: { title, description, images: image ? [image] : [] }, twitter: { card: 'summary_large_image', title, description, images: image ? [image] : [] } };
}

export default async function PropertyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = await getPublishedPropertyBySlug(slug);
  if (!result.ok) return <PropertyUnavailable message={result.message} />;
  if (!result.data) notFound();
  return <PropertyDetailClient property={result.data} />;
}

function PropertyUnavailable({ message }: { message: string }) {
  return <main className="min-h-screen bg-[#f6f1e8]"><SiteHeader /><section className="pd-container grid min-h-[65vh] place-items-center py-20 text-center"><div><p className="pd-eyebrow">Каталог</p><h1 className="mt-4 text-4xl text-[#173326] sm:text-6xl">Сторінка об’єкта тимчасово недоступна</h1><p className="mx-auto mt-5 max-w-xl leading-7 text-[#647368]">{message}</p><a href="/catalog" className="mt-8 inline-flex h-12 items-center bg-[#173326] px-6 text-sm font-semibold text-white">Повернутися до каталогу</a></div></section><SiteFooter /></main>;
}
