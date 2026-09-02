import { getSupabaseConfig } from '@/lib/supabase/config';
import { createClient } from '@/lib/supabase/server';
import type { Property, PropertyImage, PropertyStatus } from '@/lib/property-types';

type PropertyImageRow = {
  id: string;
  property_id: string;
  storage_path: string;
  alt_text: string | null;
  sort_order: number;
  is_cover: boolean;
  created_at: string;
};

export type PropertyRow = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  price: number | string;
  currency: string;
  property_type: string;
  transaction_type: string;
  status: PropertyStatus;
  city: string;
  address: string | null;
  latitude: number | string | null;
  longitude: number | string | null;
  area: number | string;
  land_area: number | string;
  bedrooms: number | null;
  bathrooms: number | null;
  rooms: number;
  floors: number | null;
  year_built: number | null;
  distance_to_lutsk_km: number | string | null;
  featured: boolean;
  published: boolean;
  highlights: string[] | null;
  attributes: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
  property_images?: PropertyImageRow[] | null;
};

export type RepositoryResult<T> =
  | { ok: true; data: T }
  | { ok: false; reason: 'unconfigured' | 'query'; message: string };

const SELECT_WITH_IMAGES = '*, property_images(*)';

function publicImageUrl(baseUrl: string, storagePath: string) {
  if (storagePath.startsWith('/properties/')) return storagePath;
  const encodedPath = storagePath
    .split('/')
    .map((part) => encodeURIComponent(part))
    .join('/');
  return `${baseUrl}/storage/v1/object/public/property-images/${encodedPath}`;
}

export function mapPropertyRow(row: PropertyRow, baseUrl: string): Property {
  const images: PropertyImage[] = (row.property_images ?? [])
    .map((image) => ({
      id: image.id,
      propertyId: image.property_id,
      storagePath: image.storage_path,
      url: publicImageUrl(baseUrl, image.storage_path),
      altText: image.alt_text || `${row.title}, ${row.city}`,
      sortOrder: image.sort_order,
      isCover: image.is_cover,
      createdAt: image.created_at,
    }))
    .sort((a, b) => Number(b.isCover) - Number(a.isCover) || a.sortOrder - b.sortOrder);

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description ?? '',
    price: Number(row.price),
    currency: row.currency,
    propertyType: row.property_type,
    transactionType: row.transaction_type,
    status: row.status,
    city: row.city,
    location: row.city,
    address: row.address ?? row.city,
    latitude: row.latitude == null ? null : Number(row.latitude),
    longitude: row.longitude == null ? null : Number(row.longitude),
    houseArea: Number(row.area),
    landArea: Number(row.land_area),
    bedrooms: row.bedrooms,
    bathrooms: row.bathrooms,
    rooms: row.rooms,
    floors: row.floors,
    year: row.year_built,
    distance:
      row.distance_to_lutsk_km == null
        ? null
        : Number(row.distance_to_lutsk_km),
    featured: row.featured,
    published: row.published,
    highlights: row.highlights ?? [],
    attributes: row.attributes ?? {},
    images,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

type ListOptions = {
  published?: boolean;
  featured?: boolean;
  excludeSold?: boolean;
  status?: PropertyStatus;
  limit?: number;
  catalogOrder?: boolean;
};

async function runListQuery(options: ListOptions = {}): Promise<RepositoryResult<Property[]>> {
  const config = getSupabaseConfig();
  if (!config) {
    return {
      ok: false,
      reason: 'unconfigured',
      message: 'Підключення до каталогу ще не налаштовано.',
    };
  }

  try {
    const supabase = await createClient();
    let query = supabase.from('properties').select(SELECT_WITH_IMAGES);
    if (options.published !== undefined) query = query.eq('published', options.published);
    if (options.featured !== undefined) query = query.eq('featured', options.featured);
    if (options.excludeSold) query = query.neq('status', 'sold');
    if (options.status) query = query.eq('status', options.status);
    query = options.catalogOrder
      ? query.order('featured', { ascending: false }).order('created_at', { ascending: false })
      : query.order('updated_at', { ascending: false });
    if (options.limit) query = query.limit(options.limit);
    const { data, error } = await query;
    if (error) throw error;
    return {
      ok: true,
      data: ((data ?? []) as PropertyRow[]).map((row) =>
        mapPropertyRow(row, config.url),
      ),
    };
  } catch (error) {
    return {
      ok: false,
      reason: 'query',
      message:
        error instanceof Error ? error.message : 'Не вдалося отримати об’єкти.',
    };
  }
}

export function getPublishedProperties() {
  return runListQuery({ published: true, catalogOrder: true });
}

export function getFeaturedProperties() {
  return runListQuery({ published: true, featured: true, excludeSold: true, limit: 3 });
}

export function getSoldProperties() {
  return runListQuery({ published: true, status: 'sold', limit: 2 });
}

export async function getPublishedPropertyBySlug(
  slug: string,
): Promise<RepositoryResult<Property | null>> {
  const config = getSupabaseConfig();
  if (!config) {
    return {
      ok: false,
      reason: 'unconfigured',
      message: 'Підключення до каталогу ще не налаштовано.',
    };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('properties')
      .select(SELECT_WITH_IMAGES)
      .eq('published', true)
      .eq('slug', slug)
      .maybeSingle();
    if (error) throw error;
    return {
      ok: true,
      data: data ? mapPropertyRow(data as PropertyRow, config.url) : null,
    };
  } catch (error) {
    return {
      ok: false,
      reason: 'query',
      message:
        error instanceof Error ? error.message : 'Не вдалося отримати об’єкт.',
    };
  }
}

export async function getAdminProperties(): Promise<RepositoryResult<Property[]>> {
  return runListQuery();
}
