'use client';

import { useMemo, useState, type ChangeEvent } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { PropertyCard } from '@/components/property-card';
import { Button } from '@/components/ui/button';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';
import type { Property } from '@/lib/property-types';

const initial = { location: 'all', maxPrice: 'all', minArea: 'all', rooms: 'all', minLand: 'all' };

export function CatalogClient({ initialItems, unavailableMessage = '' }: { initialItems: Property[]; unavailableMessage?: string }) {
  const items = initialItems;
  const [filters, setFilters] = useState(initial);
  const locations = useMemo(() => [...new Set(items.map((property) => property.location))].sort(), [items]);
  const filtered = useMemo(() => items.filter((property) => {
    if (filters.location !== 'all' && property.location !== filters.location) return false;
    if (filters.maxPrice !== 'all' && property.price > Number(filters.maxPrice)) return false;
    if (filters.minArea !== 'all' && property.houseArea < Number(filters.minArea)) return false;
    if (filters.rooms !== 'all' && property.rooms < Number(filters.rooms)) return false;
    if (filters.minLand !== 'all' && property.landArea < Number(filters.minLand)) return false;
    return true;
  }), [items, filters]);
  const update = (key: keyof typeof filters) => (event: ChangeEvent<HTMLSelectElement>) => setFilters({ ...filters, [key]: event.target.value });
  const active = Object.values(filters).some((value) => value !== 'all');

  return (
    <section className="min-h-[70vh] bg-[#f6f1e8] py-12 lg:py-20"><div className="pd-container">
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end"><div><p className="pd-eyebrow">Наші проєкти</p><h1 className="mt-4 text-5xl leading-none text-[#173326] sm:text-7xl">Будинки, які будуємо біля Луцька</h1></div><p className="max-w-md text-sm leading-6 text-[#647368]">Готові й заплановані будинки з площею, ділянкою, статусом робіт та орієнтовною комплектацією.</p></div>
      <div className="mt-10 border-y border-[#173326]/12 py-5">
        <div className="mb-4 flex items-center justify-between"><span className="flex items-center gap-2 text-sm font-semibold text-[#173326]"><SlidersHorizontal className="size-4" /> Фільтри</span>{active && <Button variant="ghost" size="sm" className="rounded-none text-[#8b413a]" onClick={() => setFilters(initial)}><X className="size-3.5" /> Очистити</Button>}</div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <FilterSelect label="Локація" value={filters.location} onChange={update('location')} options={locations.map((value) => [value, value])} />
          <FilterSelect label="Ціна до" value={filters.maxPrice} onChange={update('maxPrice')} options={[[150000, '$150 000'], [180000, '$180 000'], [220000, '$220 000'], [300000, '$300 000']]} />
          <FilterSelect label="Площа від" value={filters.minArea} onChange={update('minArea')} options={[[130, '130 м²'], [160, '160 м²'], [190, '190 м²'], [220, '220 м²']]} />
          <FilterSelect label="Кімнат від" value={filters.rooms} onChange={update('rooms')} options={[[4, '4 кімнат'], [5, '5 кімнат'], [6, '6 кімнат']]} />
          <FilterSelect label="Ділянка від" value={filters.minLand} onChange={update('minLand')} options={[[8, '8 соток'], [10, '10 соток'], [12, '12 соток'], [15, '15 соток']]} />
        </div>
      </div>
      {unavailableMessage && <div className="mt-8 border border-[#b99751]/35 bg-[#fffdf8] px-5 py-4 text-sm text-[#647368]"><strong className="block text-[#173326]">Каталог тимчасово недоступний</strong><span className="mt-1 block">{unavailableMessage}</span></div>}
      <div className="mt-8 flex items-center justify-between text-sm text-[#647368]"><p>Знайдено: {filtered.length}</p><p className="hidden sm:block">Спочатку актуальні проєкти</p></div>
      {filtered.length > 0 ? <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">{filtered.map((property) => <PropertyCard key={property.id} property={property} />)}</div> : <div className="mt-6 grid min-h-80 place-items-center border border-[#173326]/10 bg-white/40 text-center"><div><h2 className="text-3xl text-[#173326]">{unavailableMessage ? 'Об’єкти з’являться після підключення бази' : 'Нічого не знайдено'}</h2><p className="mt-2 text-sm text-[#647368]">{unavailableMessage ? 'Налаштування не впливає на інші сторінки сайту.' : 'Спробуйте змінити один або кілька фільтрів.'}</p>{!unavailableMessage && <Button className="mt-5 rounded-none bg-[#173326]" onClick={() => setFilters(initial)}>Показати всі</Button>}</div></div>}
    </div></section>
  );
}

function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (event: ChangeEvent<HTMLSelectElement>) => void; options: Array<[string | number, string]> }) {
  return <label className="grid gap-2 text-[11px] font-semibold uppercase tracking-[.12em] text-[#647368]">{label}<NativeSelect value={value} onChange={onChange} className="w-full"><NativeSelectOption value="all">Будь-яке значення</NativeSelectOption>{options.map(([optionValue, optionLabel]) => <NativeSelectOption key={optionValue} value={String(optionValue)}>{optionLabel}</NativeSelectOption>)}</NativeSelect></label>;
}
