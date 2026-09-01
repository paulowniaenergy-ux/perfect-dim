export type PropertyStatus = 'available' | 'reserved' | 'sold';

export type Property = {
  id: string;
  slug: string;
  title: string;
  location: string;
  address: string;
  distance: number;
  price: number;
  houseArea: number;
  landArea: number;
  rooms: number;
  bedrooms: number;
  floors: number;
  year: number;
  status: PropertyStatus;
  featured: boolean;
  description: string;
  highlights: string[];
  images: string[];
};

const source: Array<
  [string, string, string, number, number, number, number, number, number, number, PropertyStatus, boolean]
> = [
  ['sosnovyi-dim-strumivka', 'Сосновий дім', 'Струмівка', 7, 189000, 168, 8, 5, 3, 2025, 'available', true],
  ['villa-lipa-rovyantsi', 'Вілла «Липа»', 'Рованці', 4, 245000, 214, 12, 6, 4, 2024, 'available', true],
  ['garden-house-borokhiv', 'Садовий дім', 'Борохів', 14, 132000, 142, 10, 4, 3, 2025, 'reserved', true],
  ['dim-u-dibrovi-bogoliuby', 'Дім у діброві', 'Боголюби', 9, 168000, 176, 9, 5, 3, 2023, 'available', true],
  ['green-line-zmynets', 'Зелена лінія', 'Зміїнець', 6, 218000, 205, 11, 6, 4, 2025, 'available', false],
  ['terra-knyagynynok', 'Тера', 'Княгининок', 11, 149000, 154, 7, 5, 3, 2024, 'available', false],
  ['quiet-place-lyshche', 'Тихе місце', 'Лище', 13, 126000, 136, 8, 4, 3, 2022, 'sold', false],
  ['house-23-prylutske', 'Дім №23', 'Прилуцьке', 8, 179000, 182, 10, 5, 3, 2024, 'available', false],
  ['white-oak-baidarivka', 'Білий дуб', 'Байдарівка', 18, 114000, 128, 14, 4, 3, 2023, 'available', false],
  ['family-residence-piddubtsi', 'Родинна резиденція', 'Піддубці', 12, 198000, 196, 9, 6, 4, 2025, 'reserved', false],
  ['nord-home-girka-polonka', 'Північний дім', 'Гірка Полонка', 5, 156000, 159, 8, 5, 3, 2024, 'available', false],
  ['minimal-house-mayaky', 'Мінімальний дім', 'Маяки', 15, 138000, 145, 11, 4, 3, 2023, 'sold', false],
  ['lake-view-zhydychyn', 'Дім біля озера', 'Жидичин', 10, 272000, 238, 16, 7, 4, 2025, 'available', true],
  ['pine-courtyard-strumivka', 'Соснове подвір’я', 'Струмівка', 7, 207000, 201, 12, 6, 4, 2024, 'available', false],
  ['stone-house-rovyantsi', 'Кам’яний дім', 'Рованці', 4, 164000, 171, 8, 5, 3, 2023, 'sold', false],
  ['oaks-village-harasdzha', 'Дубова садиба', 'Гаразджа', 16, 121000, 132, 15, 4, 3, 2025, 'available', false],
  ['sunset-home-lipyny', 'Дім на заході сонця', 'Липини', 3, 232000, 220, 10, 6, 4, 2024, 'reserved', false],
  ['forest-frame-kivertsi', 'Лісовий дім', 'Ківерці', 19, 109000, 124, 9, 4, 3, 2022, 'available', false],
  ['aurora-bogoliuby', 'Аврора', 'Боголюби', 9, 176000, 184, 8, 5, 3, 2025, 'available', false],
  ['green-courtyard-zaborol', 'Зелений двір', 'Забороль', 8, 145000, 151, 13, 5, 3, 2023, 'sold', false],
];

const imageSets = [
  ['/property-hero.png', '/property-2.png', '/property-3.png'],
  ['/property-2.png', '/property-4.png', '/property-hero.png'],
  ['/property-3.png', '/property-hero.png', '/property-4.png'],
  ['/property-4.png', '/property-3.png', '/property-2.png'],
];

export const properties: Property[] = source.map((item, index) => {
  const [slug, title, location, distance, price, houseArea, landArea, rooms, bedrooms, year, status, featured] = item;
  return {
    id: `PD-${String(index + 1).padStart(3, '0')}`,
    slug,
    title,
    location,
    address: `${location}, Луцький район`,
    distance,
    price,
    houseArea,
    landArea,
    rooms,
    bedrooms,
    floors: houseArea > 185 ? 2 : 1,
    year,
    status,
    featured,
    description:
      'Продуманий заміський будинок для спокійного щоденного життя. Простір поєднує світлу кухню-вітальню, приватну спальну зону та вихід на терасу. Підведені комунікації, упорядкована ділянка й зручний доїзд до Луцька.',
    highlights: [
      'Архітектурний проєкт із природним освітленням',
      'Тераса та приватне подвір’я',
      'Енергоощадні вікна й утеплення',
      'Перевірені документи на будинок і землю',
    ],
    images: imageSets[index % imageSets.length],
  };
});

export const locations = [...new Set(properties.map((property) => property.location))].sort();

export const statusLabels: Record<PropertyStatus, string> = {
  available: 'Доступний',
  reserved: 'Заброньовано',
  sold: 'Продано',
};

export function formatPrice(price: number) {
  return new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price);
}

export function getProperty(slug: string) {
  return properties.find((property) => property.slug === slug);
}
