'use client';

import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ImagePlus,
  LoaderCircle,
  LogOut,
  Plus,
  Save,
  Search,
  Star,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';
import { Textarea } from '@/components/ui/textarea';
import {
  blankProperty,
  deleteProperty,
  deletePropertyImage,
  saveImageOrder,
  saveProperty,
  setCoverImage,
  signOut,
  uploadPropertyImages,
} from '@/lib/admin-properties';
import {
  coverImage,
  formatPrice,
  getInfrastructure,
  infrastructureOptions,
  statusLabels,
  type Property,
  type PropertyStatus,
} from '@/lib/property-types';

type Props = {
  initialItems: Property[];
  initialError: string;
  adminEmail: string;
};

export function AdminClient({ initialItems, initialError, adminEmail }: Props) {
  const [items, setItems] = useState(initialItems);
  const [draft, setDraft] = useState<Property>(() => initialItems[0] ?? blankProperty());
  const [isNew, setIsNew] = useState(initialItems.length === 0);
  const [notice, setNotice] = useState(initialError);
  const [pending, setPending] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | PropertyStatus>('all');

  const filteredItems = useMemo(() => {
    const query = search.trim().toLocaleLowerCase('uk');
    return items.filter((property) => {
      const matchesStatus = statusFilter === 'all' || property.status === statusFilter;
      const matchesQuery = !query || [property.title, property.city, property.address, property.slug]
        .some((value) => value.toLocaleLowerCase('uk').includes(query));
      return matchesStatus && matchesQuery;
    });
  }, [items, search, statusFilter]);

  const update = <K extends keyof Property>(key: K, value: Property[K]) =>
    setDraft((current) => ({ ...current, [key]: value }));

  const toggleInfrastructure = (key: (typeof infrastructureOptions)[number][0]) =>
    setDraft((current) => {
      const selected = getInfrastructure(current.attributes);
      const infrastructure = selected.includes(key)
        ? selected.filter((item) => item !== key)
        : [...selected, key];
      return {
        ...current,
        attributes: { ...current.attributes, infrastructure },
      };
    });

  const applyItems = (next: Property[], selectedId = draft.id) => {
    setItems(next);
    const selected = next.find((item) => item.id === selectedId) ?? next[0];
    if (selected) {
      setDraft(selected);
      setIsNew(false);
    } else {
      setDraft(blankProperty());
      setIsNew(true);
    }
  };

  const run = async (action: () => Promise<Property[]>, success: string, selectedId = draft.id) => {
    setPending(true);
    setNotice('');
    try {
      applyItems(await action(), selectedId);
      setNotice(success);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Не вдалося виконати дію.');
    } finally {
      setPending(false);
    }
  };

  const select = (property: Property) => {
    setDraft(structuredClone(property));
    setIsNew(false);
    setNotice('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const persist = async () => {
    if (!draft.title.trim() || !draft.city.trim() || !draft.slug.trim()) {
      setNotice('Додайте назву, населений пункт і slug.');
      return;
    }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(draft.slug)) {
      setNotice('Slug може містити лише малі латинські літери, цифри та дефіси.');
      return;
    }
    await run(() => saveProperty(draft, isNew), isNew ? 'Об’єкт створено.' : 'Зміни збережено.');
  };

  const remove = async () => {
    if (isNew || !window.confirm(`Видалити об’єкт «${draft.title}» разом з усіма його фото?`)) return;
    await run(() => deleteProperty(draft), 'Об’єкт видалено.');
  };

  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    if (isNew) {
      setNotice('Спочатку збережіть новий об’єкт, тоді завантажте фото.');
      return;
    }
    await run(() => uploadPropertyImages(draft, Array.from(files)), 'Фото завантажено.');
  };

  const removeImage = async (imageId: string) => {
    const image = draft.images.find((item) => item.id === imageId);
    if (!image || !window.confirm('Видалити це фото без можливості відновлення?')) return;
    await run(() => deletePropertyImage(draft, image), 'Фото видалено.');
  };

  const makeCover = async (imageId: string) => {
    await run(() => setCoverImage(draft.id, imageId), 'Головне фото змінено.');
  };

  const moveImage = async (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= draft.images.length) return;
    const reordered = [...draft.images];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    setDraft((current) => ({ ...current, images: reordered }));
    await run(() => saveImageOrder(reordered), 'Порядок фото змінено.');
  };

  const logout = async () => {
    setPending(true);
    await signOut();
    window.location.assign('/admin/login');
  };

  return (
    <main className="min-h-screen bg-[#eef0e8] text-[#173326]">
      <header className="border-b border-white/10 bg-[#173326] text-white">
        <div className="mx-auto flex min-h-20 max-w-[1540px] flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <div><p className="font-heading text-2xl">Perfect Dim</p><p className="text-[10px] uppercase tracking-[.2em] text-white/45">Керування об’єктами</p></div>
          <div className="flex items-center gap-4 text-sm text-white/65"><span className="hidden sm:inline">{adminEmail}</span><a href="/" className="inline-flex items-center gap-2 hover:text-white"><ArrowLeft className="size-4" /> На сайт</a><button type="button" onClick={logout} className="inline-flex items-center gap-2 hover:text-white"><LogOut className="size-4" /> Вийти</button></div>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-[1540px] lg:grid-cols-[380px_minmax(0,1fr)]">
        <aside className="min-w-0 border-r border-[#173326]/10 bg-[#f8f4ec] p-5 sm:p-7 lg:min-h-[calc(100vh-80px)]">
          <div className="flex items-center justify-between"><div><h1 className="text-3xl">Об’єкти</h1><p className="mt-1 text-xs text-[#6e7a72]">Усього: {items.length}</p></div><Button size="icon" aria-label="Додати об’єкт" className="size-11 rounded-none bg-[#c3a567] text-[#173326] hover:bg-[#d2b87f]" onClick={() => { setDraft(blankProperty()); setIsNew(true); setNotice('Створення нового об’єкта.'); }}><Plus /></Button></div>
          <div className="relative mt-5"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#748078]" /><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Пошук" className="h-11 rounded-none bg-white pl-10" /></div>
          <NativeSelect value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as 'all' | PropertyStatus)} className="mt-3 w-full [&_select]:h-11 [&_select]:w-full [&_select]:rounded-none [&_select]:bg-white"><NativeSelectOption value="all">Усі статуси</NativeSelectOption><NativeSelectOption value="available">Доступні</NativeSelectOption><NativeSelectOption value="reserved">Заброньовані</NativeSelectOption><NativeSelectOption value="sold">Продані</NativeSelectOption></NativeSelect>
          <div className="mt-5 grid max-h-[64vh] gap-2 overflow-y-auto pr-1">
            {filteredItems.map((property) => {
              const cover = coverImage(property);
              return <button key={property.id} type="button" onClick={() => select(property)} className={`flex gap-3 border p-2 text-left transition ${draft.id === property.id && !isNew ? 'border-[#b99751] bg-white' : 'border-transparent hover:bg-white/70'}`}><div className="grid size-16 shrink-0 place-items-center overflow-hidden bg-[#ded8cc] text-[10px] text-[#748078]">{cover ? <img src={cover.url} alt="" className="h-full w-full object-cover" /> : 'Без фото'}</div><span className="min-w-0 py-1"><strong className="block truncate text-sm">{property.title}</strong><small className="mt-1 block truncate text-[#718077]">{property.city} · {formatPrice(property.price, property.currency)}</small><small className={`mt-1 inline-block text-[10px] font-bold uppercase tracking-wider ${property.status === 'sold' ? 'text-[#9b352d]' : 'text-[#648056]'}`}>{statusLabels[property.status]}{!property.published ? ' · чернетка' : ''}</small></span></button>;
            })}
            {filteredItems.length === 0 && <p className="py-8 text-center text-sm text-[#718077]">Нічого не знайдено.</p>}
          </div>
        </aside>

        <section className="min-w-0 p-5 sm:p-8 lg:p-12">
          <div className="mx-auto min-w-0 max-w-5xl">
            <div className="flex flex-col justify-between gap-4 border-b border-[#173326]/10 pb-6 sm:flex-row sm:items-center"><div><p className="pd-eyebrow">{isNew ? 'Новий об’єкт' : draft.slug}</p><h2 className="mt-2 text-4xl">{draft.title || 'Без назви'}</h2></div><div className="flex flex-wrap gap-2"><Button variant="outline" className="rounded-none border-[#173326]/20 bg-transparent" onClick={remove} disabled={isNew || pending}><Trash2 className="size-4" /> Видалити</Button><Button className="rounded-none bg-[#173326] px-5 hover:bg-[#254b39]" onClick={persist} disabled={pending}>{pending ? <LoaderCircle className="size-4 animate-spin" /> : <Save className="size-4" />} Зберегти</Button></div></div>
            {notice && <div className="mt-5 flex items-start gap-2 bg-white px-4 py-3 text-sm text-[#52665a]"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#728d55]" /> {notice}</div>}

            <div className="mt-8 grid min-w-0 gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,.78fr)]">
              <div className="grid min-w-0 gap-5 bg-[#f8f4ec] p-5 sm:p-7">
                <h3 className="text-2xl">Основна інформація</h3>
                <Field label="Назва"><Input value={draft.title} onChange={(event) => update('title', event.target.value)} className="h-11 rounded-none bg-white" /></Field>
                <Field label="Slug"><Input value={draft.slug} onChange={(event) => update('slug', event.target.value.toLowerCase())} className="h-11 rounded-none bg-white" placeholder="sosnovyi-dim-strumivka" /></Field>
                <div className="grid gap-4 sm:grid-cols-2"><Field label="Тип об’єкта"><Input value={draft.propertyType} onChange={(event) => update('propertyType', event.target.value)} className="h-11 rounded-none bg-white" /></Field><Field label="Тип угоди"><Input value={draft.transactionType} onChange={(event) => update('transactionType', event.target.value)} className="h-11 rounded-none bg-white" /></Field></div>
                <div className="grid gap-4 sm:grid-cols-2"><Field label="Населений пункт"><Input value={draft.city} onChange={(event) => update('city', event.target.value)} className="h-11 rounded-none bg-white" /></Field><NumberInput label="Відстань до Луцька, км" value={draft.distance} onChange={(value) => update('distance', value)} /></div>
                <Field label="Адреса"><Input value={draft.address} onChange={(event) => update('address', event.target.value)} className="h-11 rounded-none bg-white" /></Field>
                <div className="grid gap-4 sm:grid-cols-[1fr_110px]"><NumberInput label="Ціна" value={draft.price} required onChange={(value) => update('price', value ?? 0)} /><Field label="Валюта"><Input maxLength={3} value={draft.currency} onChange={(event) => update('currency', event.target.value.toUpperCase())} className="h-11 rounded-none bg-white" /></Field></div>
                <Field label="Статус"><NativeSelect value={draft.status} onChange={(event) => update('status', event.target.value as PropertyStatus)} className="w-full [&_select]:h-11 [&_select]:w-full [&_select]:rounded-none [&_select]:bg-white"><NativeSelectOption value="available">Доступний</NativeSelectOption><NativeSelectOption value="reserved">Заброньований</NativeSelectOption><NativeSelectOption value="sold">Проданий</NativeSelectOption></NativeSelect></Field>
                <div className="grid gap-4 sm:grid-cols-3"><NumberInput label="Будинок, м²" value={draft.houseArea} required onChange={(value) => update('houseArea', value ?? 0)} /><NumberInput label="Ділянка, сот." value={draft.landArea} required onChange={(value) => update('landArea', value ?? 0)} /><NumberInput label="Кімнат" value={draft.rooms} required onChange={(value) => update('rooms', value ?? 0)} /></div>
                <div className="grid gap-4 sm:grid-cols-3"><NumberInput label="Спалень" value={draft.bedrooms} onChange={(value) => update('bedrooms', value)} /><NumberInput label="Санвузлів" value={draft.bathrooms} onChange={(value) => update('bathrooms', value)} /><NumberInput label="Поверхів" value={draft.floors} onChange={(value) => update('floors', value)} /></div>
                <div className="grid gap-4 sm:grid-cols-3"><NumberInput label="Рік побудови" value={draft.year} onChange={(value) => update('year', value)} /><NumberInput label="Широта" value={draft.latitude} step="any" onChange={(value) => update('latitude', value)} /><NumberInput label="Довгота" value={draft.longitude} step="any" onChange={(value) => update('longitude', value)} /></div>
                <Field label="Опис"><Textarea value={draft.description} onChange={(event) => update('description', event.target.value)} rows={7} className="min-h-40 rounded-none bg-white" /></Field>
                <Field label="Особливості — одна на рядок"><Textarea value={draft.highlights.join('\n')} onChange={(event) => update('highlights', event.target.value.split('\n').map((value) => value.trim()).filter(Boolean))} rows={5} className="rounded-none bg-white" /></Field>
                <fieldset className="border border-[#173326]/12 bg-white p-4 sm:p-5">
                  <legend className="px-1 text-sm font-semibold text-[#173326]">Комунікації та територія</legend>
                  <p className="mb-4 text-xs leading-5 text-[#6e7a72]">Відмітьте лише те, що фактично є в цьому об’єкті. Пункти будуть показані на сторінці будинку.</p>
                  <div className="grid gap-x-5 gap-y-3 sm:grid-cols-2">
                    {infrastructureOptions.map(([key, label]) => <label key={key} className="flex items-center gap-3 text-sm text-[#43594c]"><input type="checkbox" checked={getInfrastructure(draft.attributes).includes(key)} onChange={() => toggleInfrastructure(key)} className="size-4 accent-[#173326]" /> {label}</label>)}
                  </div>
                </fieldset>
                <label className="flex items-center gap-3 text-sm"><input type="checkbox" checked={draft.published} onChange={(event) => update('published', event.target.checked)} className="size-4 accent-[#173326]" /> Опубліковано</label>
                <label className="flex items-center gap-3 text-sm"><input type="checkbox" checked={draft.featured} onChange={(event) => update('featured', event.target.checked)} className="size-4 accent-[#173326]" /> Показувати у вибраних на головній</label>
                {draft.status === 'sold' && <p className="bg-[#f4ddd8] px-4 py-3 text-sm text-[#7b2e28]">Опублікований проданий об’єкт залишиться в каталозі з позначкою «Продано».</p>}
              </div>

              <div className="h-fit min-w-0 bg-[#f8f4ec] p-5 sm:p-7">
                <h3 className="text-2xl">Фото об’єкта</h3><p className="mt-2 text-xs leading-5 text-[#6e7a72]">JPG, PNG, WebP або AVIF до 10 МБ. Фото зберігаються у Supabase Storage, не в GitHub.</p>
                <label className={`mt-5 flex items-center justify-center gap-2 border border-dashed border-[#173326]/30 bg-white px-5 py-8 text-sm font-semibold ${isNew || pending ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:border-[#b99751]'}`}><ImagePlus className="size-5 text-[#b99751]" /> Завантажити фото<Input type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple disabled={isNew || pending} className="sr-only" onChange={(event) => { void upload(event.target.files); event.target.value = ''; }} /></label>
                {isNew && <p className="mt-3 text-xs text-[#8b6750]">Спочатку збережіть основну інформацію.</p>}
                <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
                  {draft.images.map((image, index) => <div key={image.id} className="group relative aspect-[4/3] overflow-hidden bg-[#ddd5c6]"><img src={image.url} alt={image.altText} className="h-full w-full object-cover" /><div className="absolute inset-x-2 top-2 flex justify-between gap-1"><div className="flex gap-1"><button type="button" disabled={pending || index === 0} onClick={() => void moveImage(index, -1)} aria-label="Перемістити фото ліворуч" className="grid size-8 place-items-center bg-[#173326]/90 text-white disabled:opacity-35"><ChevronLeft className="size-4" /></button><button type="button" disabled={pending || index === draft.images.length - 1} onClick={() => void moveImage(index, 1)} aria-label="Перемістити фото праворуч" className="grid size-8 place-items-center bg-[#173326]/90 text-white disabled:opacity-35"><ChevronRight className="size-4" /></button></div><button type="button" disabled={pending} onClick={() => void removeImage(image.id)} aria-label="Видалити фото" className="grid size-8 place-items-center bg-[#173326]/90 text-white"><Trash2 className="size-3.5" /></button></div><button type="button" disabled={pending || image.isCover} onClick={() => void makeCover(image.id)} className={`absolute bottom-2 left-2 inline-flex items-center gap-1 px-2 py-1 text-[9px] font-bold uppercase tracking-wider ${image.isCover ? 'bg-[#c3a567] text-[#173326]' : 'bg-[#173326]/90 text-white'}`}><Star className="size-3" /> {image.isCover ? 'Головне' : 'Зробити головним'}</button></div>)}
                </div>
                {!draft.images.length && !isNew && <p className="mt-5 bg-white px-4 py-5 text-center text-sm text-[#718077]">Фото ще не завантажено.</p>}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="grid gap-2"><Label>{label}</Label>{children}</div>;
}

function NumberInput({ label, value, onChange, required = false, step = '1' }: { label: string; value: number | null; onChange: (value: number | null) => void; required?: boolean; step?: string }) {
  return <Field label={label}><Input type="number" min={required ? 0 : undefined} step={step} value={value ?? ''} onChange={(event) => onChange(event.target.value === '' ? null : Number(event.target.value))} className="h-11 rounded-none bg-white" /></Field>;
}
