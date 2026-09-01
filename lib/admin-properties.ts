'use client';

import { createClient } from '@/lib/supabase/client';
import { getSupabaseConfig, PROPERTY_IMAGES_BUCKET } from '@/lib/supabase/config';
import { mapPropertyRow, type PropertyRow } from '@/lib/properties-repository';
import type { Property, PropertyImage } from '@/lib/property-types';

const ADMIN_SELECT = '*, property_images(*)';
const ALLOWED_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
]);
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export function blankProperty(): Property {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    slug: '',
    title: '',
    description: '',
    price: 0,
    currency: 'USD',
    propertyType: 'house',
    transactionType: 'sale',
    status: 'available',
    city: '',
    location: '',
    address: '',
    latitude: null,
    longitude: null,
    houseArea: 0,
    landArea: 0,
    bedrooms: null,
    bathrooms: null,
    rooms: 0,
    floors: null,
    year: null,
    distance: null,
    featured: false,
    published: false,
    highlights: [],
    attributes: {},
    images: [],
    createdAt: now,
    updatedAt: now,
  };
}

function propertyMutation(property: Property) {
  return {
    id: property.id,
    slug: property.slug.trim(),
    title: property.title.trim(),
    description: property.description.trim(),
    price: property.price,
    currency: property.currency.toUpperCase(),
    property_type: property.propertyType,
    transaction_type: property.transactionType,
    status: property.status,
    city: property.city.trim(),
    address: property.address.trim() || null,
    latitude: property.latitude,
    longitude: property.longitude,
    area: property.houseArea,
    land_area: property.landArea,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    rooms: property.rooms,
    floors: property.floors,
    year_built: property.year,
    distance_to_lutsk_km: property.distance,
    featured: property.featured,
    published: property.published,
    highlights: property.highlights,
    attributes: property.attributes,
  };
}

export async function fetchAdminProperties(client = createClient()) {
  const config = getSupabaseConfig();
  if (!config) throw new Error('Supabase не налаштовано.');
  const { data, error } = await client
    .from('properties')
    .select(ADMIN_SELECT)
    .order('updated_at', { ascending: false });
  if (error) throw error;
  return ((data ?? []) as PropertyRow[]).map((row) =>
    mapPropertyRow(row, config.url),
  );
}

export async function saveProperty(property: Property, isNew: boolean) {
  const client = createClient();
  const mutation = propertyMutation(property);
  const operation = isNew
    ? client.from('properties').insert(mutation)
    : client.from('properties').update(mutation).eq('id', property.id);
  const { error } = await operation;
  if (error) throw error;
  return fetchAdminProperties(client);
}

export async function deleteProperty(property: Property) {
  const client = createClient();
  const paths = property.images.map((image) => image.storagePath);
  if (paths.length > 0) {
    const { error: storageError } = await client.storage
      .from(PROPERTY_IMAGES_BUCKET)
      .remove(paths);
    if (storageError) throw storageError;
  }
  const { error } = await client.from('properties').delete().eq('id', property.id);
  if (error) throw error;
  return fetchAdminProperties(client);
}

function extensionFor(file: File) {
  const byType: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/avif': 'avif',
  };
  return byType[file.type];
}

export async function uploadPropertyImages(
  property: Property,
  files: File[],
) {
  const client = createClient();
  let nextOrder =
    property.images.reduce((max, image) => Math.max(max, image.sortOrder), -1) + 1;

  for (const [index, file] of files.entries()) {
    if (!ALLOWED_TYPES.has(file.type)) {
      throw new Error(`Формат «${file.name}» не підтримується. Використайте JPG, PNG, WebP або AVIF.`);
    }
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`Файл «${file.name}» перевищує 10 МБ.`);
    }

    const extension = extensionFor(file);
    const storagePath = `${property.id}/${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await client.storage
      .from(PROPERTY_IMAGES_BUCKET)
      .upload(storagePath, file, {
        cacheControl: '31536000',
        contentType: file.type,
        upsert: false,
      });
    if (uploadError) throw uploadError;

    const { error: rowError } = await client.from('property_images').insert({
      property_id: property.id,
      storage_path: storagePath,
      alt_text: `${property.title}, ${property.city}`,
      sort_order: nextOrder,
      is_cover: property.images.length === 0 && index === 0,
    });
    if (rowError) {
      await client.storage.from(PROPERTY_IMAGES_BUCKET).remove([storagePath]);
      throw rowError;
    }
    nextOrder += 1;
  }

  return fetchAdminProperties(client);
}

export async function deletePropertyImage(
  property: Property,
  image: PropertyImage,
) {
  const client = createClient();
  const { error: storageError } = await client.storage
    .from(PROPERTY_IMAGES_BUCKET)
    .remove([image.storagePath]);
  if (storageError) throw storageError;
  const { error } = await client.from('property_images').delete().eq('id', image.id);
  if (error) throw error;

  if (image.isCover) {
    const replacement = property.images.find((item) => item.id !== image.id);
    if (replacement) {
      const { error: coverError } = await client
        .from('property_images')
        .update({ is_cover: true })
        .eq('id', replacement.id);
      if (coverError) throw coverError;
    }
  }
  return fetchAdminProperties(client);
}

export async function setCoverImage(propertyId: string, imageId: string) {
  const client = createClient();
  const { error: clearError } = await client
    .from('property_images')
    .update({ is_cover: false })
    .eq('property_id', propertyId);
  if (clearError) throw clearError;
  const { error } = await client
    .from('property_images')
    .update({ is_cover: true })
    .eq('id', imageId);
  if (error) throw error;
  return fetchAdminProperties(client);
}

export async function saveImageOrder(images: PropertyImage[]) {
  const client = createClient();
  for (const [sortOrder, image] of images.entries()) {
    const { error } = await client
      .from('property_images')
      .update({ sort_order: sortOrder })
      .eq('id', image.id);
    if (error) throw error;
  }
  return fetchAdminProperties(client);
}

export async function signOut() {
  const client = createClient();
  await client.auth.signOut();
}
