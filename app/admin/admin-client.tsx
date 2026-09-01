'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle2, ImagePlus, Plus, RotateCcw, Save, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';
import { Textarea } from '@/components/ui/textarea';
import { loadProperties, resetProperties, saveProperties } from '@/lib/property-store';
import { formatPrice, statusLabels, type Property, type PropertyStatus } from '@/lib/properties';

const blank = (): Property => ({ id: `PD-${Date.now()}`, slug: `novyi-dim-${Date.now()}`, title: '', location: '', address: '', distance: 5, price: 150000, houseArea: 150, landArea: 10, rooms: 5, bedrooms: 3, floors: 1, year: 2026, status: 'available', featured: false, description: '', highlights: ['Продумане планування', 'Власна ділянка', 'Зручний доїзд до Луцька'], images: ['/property-hero.png', '/property-2.png', '/property-3.png'] });

export function AdminClient() {
  const [items, setItems] = useState<Property[]>([]);
  const [draft, setDraft] = useState<Property>(blank());
  const [isNew, setIsNew] = useState(true);
  const [notice, setNotice] = useState('');
  useEffect(() => { const current = loadProperties(); setItems(current); setDraft(current[0]); setIsNew(false); }, []);

  const select = (property: Property) => { setDraft(structuredClone(property)); setIsNew(false); setNotice(''); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const update = <K extends keyof Property>(key: K, value: Property[K]) => setDraft((current) => ({ ...current, [key]: value }));
  const persist = () => {
    if (!draft.title.trim() || !draft.location.trim()) { setNotice('Додайте назву й локацію.'); return; }
    const normalized = { ...draft, address: draft.address || `${draft.location}, Луцький район` };
    const next = isNew ? [normalized, ...items] : items.map((item) => item.id === normalized.id ? normalized : item);
    try { saveProperties(next); setItems(next); setDraft(normalized); setIsNew(false); setNotice('Зміни збережено локально.'); } catch { setNotice('Не вдалося зберегти. Спробуйте менші фото або видаліть зайві.'); }
  };
  const remove = () => {
    if (isNew || !window.confirm(`Видалити об’єкт «${draft.title}»?`)) return;
    const next = items.filter((item) => item.id !== draft.id); saveProperties(next); setItems(next); setDraft(next[0] || blank()); setIsNew(next.length === 0); setNotice('Об’єкт видалено.');
  };
  const restore = () => {
    if (!window.confirm('Повернути початкові 20 демонстраційних об’єктів? Локальні зміни буде втрачено.')) return;
    resetProperties(); const next = loadProperties(); setItems(next); setDraft(next[0]); setIsNew(false); setNotice('Демонстраційні дані відновлено.');
  };
  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    const additions = await Promise.all(Array.from(files).slice(0, 6).map(compressImage));
    update('images', [...draft.images.filter((image) => !image.startsWith('/property-')), ...additions].slice(0, 6));
    setNotice('Фото додано до форми. Натисніть «Зберегти зміни».');
  };

  return (
    <main className="min-h-screen bg-[#eef0e8] text-[#173326]">
      <header className="border-b border-[#173326]/10 bg-[#173326] text-white"><div className="mx-auto flex h-20 max-w-[1540px] items-center justify-between px-5 sm:px-8"><div><p className="font-heading text-2xl">Perfect Dim</p><p className="text-[10px] uppercase tracking-[.2em] text-white/45">Керування об’єктами</p></div><a href="/" className="inline-flex items-center gap-2 text-sm text-white/65 hover:text-white"><ArrowLeft className="size-4" /> На сайт</a></div></header>
      <div className="mx-auto grid max-w-[1540px] gap-0 lg:grid-cols-[360px_1fr]">
        <aside className="border-r border-[#173326]/10 bg-[#f8f4ec] p-5 lg:min-h-[calc(100vh-80px)] sm:p-7">
          <div className="flex items-center justify-between"><div><h1 className="text-3xl">Об’єкти</h1><p className="mt-1 text-xs text-[#6e7a72]">Усього: {items.length}</p></div><Button size="icon" aria-label="Додати об’єкт" className="size-11 rounded-none bg-[#c3a567] text-[#173326] hover:bg-[#d2b87f]" onClick={() => { setDraft(blank()); setIsNew(true); setNotice('Новий об’єкт'); }}><Plus /></Button></div>
          <div className="mt-6 grid max-h-[68vh] gap-2 overflow-y-auto pr-1">{items.map((property) => <button key={property.id} type="button" onClick={() => select(property)} className={`flex gap-3 border p-2 text-left transition ${draft.id === property.id && !isNew ? 'border-[#b99751] bg-white' : 'border-transparent hover:bg-white/70'}`}><img src={property.images[0]} alt="" className="size-16 shrink-0 object-cover" /><span className="min-w-0 py-1"><strong className="block truncate text-sm">{property.title}</strong><small className="mt-1 block text-[#718077]">{property.location} · {formatPrice(property.price)}</small><small className={`mt-1 inline-block text-[10px] font-bold uppercase tracking-wider ${property.status === 'sold' ? 'text-[#9b352d]' : 'text-[#648056]'}`}>{statusLabels[property.status]}</small></span></button>)}</div>
          <Button variant="ghost" className="mt-6 w-full justify-start rounded-none text-[#6a756d]" onClick={restore}><RotateCcw className="size-4" /> Відновити демодані</Button>
        </aside>

        <section className="p-5 sm:p-8 lg:p-12">
          <div className="mx-auto max-w-5xl"><div className="flex flex-col justify-between gap-4 border-b border-[#173326]/10 pb-6 sm:flex-row sm:items-center"><div><p className="pd-eyebrow">{isNew ? 'Новий об’єкт' : draft.id}</p><h2 className="mt-2 text-4xl">{draft.title || 'Без назви'}</h2></div><div className="flex gap-2"><Button variant="outline" className="rounded-none border-[#173326]/20 bg-transparent" onClick={remove} disabled={isNew}><Trash2 className="size-4" /> Видалити</Button><Button className="rounded-none bg-[#173326] px-5 hover:bg-[#254b39]" onClick={persist}><Save className="size-4" /> Зберегти зміни</Button></div></div>
          {notice && <div className="mt-5 flex items-center gap-2 bg-white px-4 py-3 text-sm text-[#52665a]"><CheckCircle2 className="size-4 text-[#728d55]" /> {notice}</div>}

          <div className="mt-8 grid gap-8 xl:grid-cols-[1fr_.78fr]">
            <div className="grid gap-5 bg-[#f8f4ec] p-5 sm:p-7">
              <h3 className="text-2xl">Основна інформація</h3>
              <Field label="Назва"><Input value={draft.title} onChange={(e) => update('title', e.target.value)} className="h-11 rounded-none bg-white" placeholder="Наприклад, Сосновий дім" /></Field>
              <div className="grid gap-4 sm:grid-cols-2"><Field label="Локація"><Input value={draft.location} onChange={(e) => update('location', e.target.value)} className="h-11 rounded-none bg-white" /></Field><Field label="Відстань до Луцька, км"><Input type="number" min="0" value={draft.distance} onChange={(e) => update('distance', Number(e.target.value))} className="h-11 rounded-none bg-white" /></Field></div>
              <Field label="Адреса"><Input value={draft.address} onChange={(e) => update('address', e.target.value)} className="h-11 rounded-none bg-white" /></Field>
              <div className="grid gap-4 sm:grid-cols-2"><Field label="Ціна, USD"><Input type="number" min="0" value={draft.price} onChange={(e) => update('price', Number(e.target.value))} className="h-11 rounded-none bg-white" /></Field><Field label="Статус"><NativeSelect value={draft.status} onChange={(e) => update('status', e.target.value as PropertyStatus)} className="w-full [&_select]:h-11 [&_select]:rounded-none [&_select]:bg-white"><NativeSelectOption value="available">Доступний</NativeSelectOption><NativeSelectOption value="reserved">Заброньований</NativeSelectOption><NativeSelectOption value="sold">Проданий</NativeSelectOption></NativeSelect></Field></div>
              <div className="grid gap-4 sm:grid-cols-3"><Field label="Будинок, м²"><Input type="number" value={draft.houseArea} onChange={(e) => update('houseArea', Number(e.target.value))} className="h-11 rounded-none bg-white" /></Field><Field label="Ділянка, сот."><Input type="number" value={draft.landArea} onChange={(e) => update('landArea', Number(e.target.value))} className="h-11 rounded-none bg-white" /></Field><Field label="Кімнат"><Input type="number" value={draft.rooms} onChange={(e) => update('rooms', Number(e.target.value))} className="h-11 rounded-none bg-white" /></Field></div>
              <div className="grid gap-4 sm:grid-cols-3"><Field label="Спалень"><Input type="number" value={draft.bedrooms} onChange={(e) => update('bedrooms', Number(e.target.value))} className="h-11 rounded-none bg-white" /></Field><Field label="Поверхів"><Input type="number" value={draft.floors} onChange={(e) => update('floors', Number(e.target.value))} className="h-11 rounded-none bg-white" /></Field><Field label="Рік"><Input type="number" value={draft.year} onChange={(e) => update('year', Number(e.target.value))} className="h-11 rounded-none bg-white" /></Field></div>
              <Field label="Опис"><Textarea value={draft.description} onChange={(e) => update('description', e.target.value)} rows={6} className="min-h-36 rounded-none bg-white" /></Field>
              <label className="flex items-center gap-3 text-sm"><input type="checkbox" checked={draft.featured} onChange={(e) => update('featured', e.target.checked)} className="size-4 accent-[#173326]" /> Показувати у вибраних на головній</label>
              {draft.status === 'sold' && <p className="bg-[#f4ddd8] px-4 py-3 text-sm text-[#7b2e28]">Проданий об’єкт залишиться видимим у каталозі з помітною позначкою «Продано».</p>}
            </div>

            <div className="h-fit bg-[#f8f4ec] p-5 sm:p-7"><h3 className="text-2xl">Фото об’єкта</h3><p className="mt-2 text-xs leading-5 text-[#6e7a72]">У локальному режимі фото стискаються й зберігаються лише у цьому браузері.</p><label className="mt-5 flex cursor-pointer items-center justify-center gap-2 border border-dashed border-[#173326]/30 bg-white px-5 py-8 text-sm font-semibold hover:border-[#b99751]"><ImagePlus className="size-5 text-[#b99751]" /> Завантажити фото<Input type="file" accept="image/*" multiple className="sr-only" onChange={(e) => upload(e.target.files)} /></label><div className="mt-5 grid grid-cols-2 gap-3">{draft.images.map((image, index) => <div key={`${image.slice(0, 40)}-${index}`} className="group relative aspect-[4/3] overflow-hidden bg-[#ddd5c6]"><img src={image} alt={`Фото ${index + 1}`} className="h-full w-full object-cover" /><button type="button" onClick={() => update('images', draft.images.filter((_, imageIndex) => imageIndex !== index))} aria-label="Видалити фото" className="absolute right-2 top-2 grid size-8 place-items-center bg-[#173326]/85 text-white opacity-0 transition group-hover:opacity-100"><Trash2 className="size-3.5" /></button>{index === 0 && <span className="absolute bottom-2 left-2 bg-[#c3a567] px-2 py-1 text-[9px] font-bold uppercase tracking-wider">Головне</span>}</div>)}</div></div>
          </div></div>
        </section>
      </div>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <div className="grid gap-2"><Label>{label}</Label>{children}</div>; }

function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const image = new Image();
      image.onerror = reject;
      image.onload = () => {
        const scale = Math.min(1, 1400 / Math.max(image.width, image.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(image.width * scale); canvas.height = Math.round(image.height * scale);
        canvas.getContext('2d')?.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.72));
      };
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}
