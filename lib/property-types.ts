export type PropertyStatus = 'available' | 'reserved' | 'sold';

export const infrastructureOptions = [
  ['gas', 'Газифікація'],
  ['electricity', 'Електрика на ділянці'],
  ['water', 'Вода'],
  ['sewerage', 'Каналізація'],
  ['internet', 'Оптичний інтернет'],
  ['access-road', 'Під’їздна дорога'],
  ['paving', 'Бруківка навколо будинку'],
  ['landscaping', 'Облаштування території'],
  ['fence', 'Огорожа та ворота'],
  ['outdoor-lighting', 'Вуличне освітлення'],
  ['drainage', 'Водовідведення'],
] as const;

export type InfrastructureKey = (typeof infrastructureOptions)[number][0];

export function getInfrastructure(attributes: Record<string, unknown>) {
  const values = attributes.infrastructure;
  if (!Array.isArray(values)) return [] as InfrastructureKey[];
  const allowed = new Set<string>(infrastructureOptions.map(([key]) => key));
  return values.filter(
    (value): value is InfrastructureKey =>
      typeof value === 'string' && allowed.has(value),
  );
}

export type PropertyImage = {
  id: string;
  propertyId: string;
  storagePath: string;
  url: string;
  altText: string;
  sortOrder: number;
  isCover: boolean;
  createdAt: string;
};

export type Property = {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  propertyType: string;
  transactionType: string;
  status: PropertyStatus;
  city: string;
  location: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  houseArea: number;
  landArea: number;
  bedrooms: number | null;
  bathrooms: number | null;
  rooms: number;
  floors: number | null;
  year: number | null;
  distance: number | null;
  featured: boolean;
  published: boolean;
  highlights: string[];
  attributes: Record<string, unknown>;
  images: PropertyImage[];
  createdAt: string;
  updatedAt: string;
};

export const statusLabels: Record<PropertyStatus, string> = {
  available: 'Доступний',
  reserved: 'Заброньовано',
  sold: 'Продано',
};

export function formatPrice(price: number, currency = 'USD') {
  return new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}

export function coverImage(property: Property) {
  return (
    property.images.find((image) => image.isCover) ?? property.images[0] ?? null
  );
}
