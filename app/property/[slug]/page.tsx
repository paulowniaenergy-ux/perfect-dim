import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProperty, properties } from '@/lib/properties';
import { PropertyDetailClient } from './property-detail-client';

export function generateStaticParams() {
  return properties.map((property) => ({ slug: property.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const property = getProperty(slug);
  if (!property) return { title: 'Об’єкт не знайдено — Perfect Dim' };
  const title = `${property.title}, ${property.location} — Perfect Dim`;
  const description = `Будинок ${property.houseArea} м², ділянка ${property.landArea} соток, ${property.rooms} кімнат. ${property.location}, біля Луцька.`;
  return { title, description, openGraph: { title, description, images: [property.images[0]] }, twitter: { card: 'summary_large_image', title, description, images: [property.images[0]] } };
}

export default async function PropertyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const property = getProperty(slug);
  if (!property) notFound();
  return <PropertyDetailClient seed={property} />;
}
