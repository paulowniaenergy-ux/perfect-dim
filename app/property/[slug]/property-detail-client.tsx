'use client';

import { BedDouble, Check, LandPlot, MapPin, Maximize2, MessageCircle, Phone, Send } from 'lucide-react';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { ContactForm } from '@/components/contact-form';
import { formatPrice, getInfrastructure, infrastructureOptions, statusLabels, type Property } from '@/lib/property-types';

export function PropertyDetailClient({ property }: { property: Property }) {
  const isVisualization = property.attributes.source === 'visualization';
  const infrastructure = getInfrastructure(property.attributes);
  const infrastructureLabels = infrastructure.flatMap((key) => {
    const label = infrastructureOptions.find(([option]) => option === key)?.[1];
    return label ? [label] : [];
  });
  const gallery = property.images.length > 0 ? property.images : [0, 1, 2].map((index) => ({ id: `fallback-${index}`, propertyId: property.id, storagePath: '', url: '/property-hero.png', altText: `${property.title} — фото буде додано`, sortOrder: index, isCover: index === 0, createdAt: '' }));
  const galleryAt = (index: number) => gallery[index] ?? gallery[0];
  const statusTone = property.status === 'sold' ? 'bg-[#9b352d]' : property.status === 'reserved' ? 'bg-[#c3a567] text-[#173326]' : 'bg-[#173326]';
  return (
    <main className="bg-[#f6f1e8]"><SiteHeader />
      <section className="pd-container py-8 lg:py-12">
        <div className="mb-7 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div><a href="/catalog" className="text-xs font-semibold uppercase tracking-[.15em] text-[#9a783b]">← Назад до каталогу</a><h1 className="mt-4 text-5xl leading-none text-[#173326] sm:text-7xl">{property.title}</h1><p className="mt-4 flex items-center gap-2 text-sm text-[#647368]"><MapPin className="size-4 text-[#b99751]" /> {property.address}{property.distance != null ? ` · ${property.distance} км від Луцька` : ''}</p></div>
          <div className="lg:text-right"><span className={`inline-flex px-4 py-2 text-xs font-bold uppercase tracking-[.15em] text-white ${statusTone}`}>{statusLabels[property.status]}</span><p className="mt-4 text-3xl font-semibold text-[#173326]">{formatPrice(property.price, property.currency)}</p></div>
        </div>
        {property.status === 'sold' && <div className="mb-6 bg-[#8d342d] px-5 py-4 text-center text-sm font-semibold text-white">Цей будинок уже передано власникам. Він залишається на сайті як приклад реалізованого проєкту Perfect Dim.</div>}
        {isVisualization && <div className="mb-6 border border-[#b99751]/45 bg-[#fff8e9] px-5 py-4 text-sm leading-6 text-[#43594c]"><strong className="text-[#173326]">Візуалізація з орієнтовними параметрами.</strong> Площу, ціну, локацію та конструктивні рішення потрібно підтвердити перед укладенням угоди.</div>}
        <div className="grid gap-3 lg:grid-cols-[1.7fr_1fr]">
          <img src={galleryAt(0).url} alt={galleryAt(0).altText} className="aspect-[16/10] h-full w-full object-cover" />
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-1"><img src={galleryAt(1).url} alt={galleryAt(1).altText} className="h-full min-h-44 w-full object-cover" /><img src={galleryAt(2).url} alt={galleryAt(2).altText} className="h-full min-h-44 w-full object-cover" /></div>
        </div>
        {gallery.length > 3 && <div className="mt-10"><div className="flex items-end justify-between gap-4"><div><p className="pd-eyebrow">Галерея</p><h2 className="mt-3 text-3xl text-[#173326]">Ще фото об’єкта</h2></div><p className="text-sm text-[#647368]">Усього: {gallery.length} фото</p></div><div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{gallery.slice(3).map((image) => <img key={image.id} src={image.url} alt={image.altText} className="aspect-[4/3] w-full object-cover" />)}</div></div>}
      </section>

      <section className="pd-container grid gap-12 pb-20 pt-6 lg:grid-cols-[1.35fr_.65fr] lg:pb-28">
        <div>
          <div className="grid grid-cols-2 gap-px bg-[#173326]/12 sm:grid-cols-4">
            <Spec icon={Maximize2} value={`${property.houseArea} м²`} label="Площа будинку" /><Spec icon={BedDouble} value={`${property.rooms}`} label="Кімнат" /><Spec icon={LandPlot} value={`${property.landArea} сот.`} label="Ділянка" /><Spec icon={Maximize2} value={property.floors ? `${property.floors}` : '—'} label="Поверхів" />
          </div>
          <div className="mt-12"><p className="pd-eyebrow">Про будинок</p><h2 className="mt-4 text-4xl text-[#173326]">Стан, планування та комплектація</h2><p className="mt-6 max-w-3xl text-base leading-8 text-[#586a5f]">{property.description}</p></div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">{property.highlights.map((item) => <p key={item} className="flex items-start gap-3 border-t border-[#173326]/12 pt-4 text-sm text-[#43594c]"><Check className="mt-0.5 size-4 shrink-0 text-[#b99751]" /> {item}</p>)}</div>
          {infrastructureLabels.length > 0 && <div className="mt-12 border-t border-[#173326]/12 pt-8"><p className="pd-eyebrow">Комунікації та територія</p><h2 className="mt-3 text-3xl text-[#173326]">Що вже передбачено</h2><div className="mt-6 grid gap-3 sm:grid-cols-2">{infrastructureLabels.map((label) => <p key={label} className="flex items-center gap-3 bg-white px-4 py-3 text-sm text-[#43594c]"><Check className="size-4 shrink-0 text-[#b99751]" /> {label}</p>)}</div></div>}
          <div className="mt-12 bg-[#e8dec9] p-7 sm:p-9"><p className="pd-eyebrow">Локація</p><h2 className="mt-3 text-3xl text-[#173326]">{property.location}, Луцький район</h2><div className="mt-6 grid gap-5 sm:grid-cols-3"><p><span className="block text-2xl font-semibold text-[#173326]">{property.distance != null ? `${property.distance} км` : 'Уточнюється'}</span><span className="text-xs text-[#647368]">до центру Луцька</span></p><p><span className="block text-2xl font-semibold text-[#173326]">15–25 хв</span><span className="text-xs text-[#647368]">автомобілем</span></p><p><span className="block text-2xl font-semibold text-[#173326]">Поруч</span><span className="text-xs text-[#647368]">магазини й школа</span></p></div></div>
        </div>
        <aside className="h-fit bg-white p-6 shadow-[0_20px_60px_rgba(23,51,38,.08)] lg:sticky lg:top-5"><p className="pd-eyebrow">Екскурсія на об’єкт</p><h2 className="mt-3 text-3xl text-[#173326]">Домовитися про огляд</h2><div className="mt-6 grid grid-cols-2 gap-2"><a href="tel:+380671234567" className="col-span-2 inline-flex h-12 items-center justify-center gap-2 bg-[#173326] text-sm font-semibold text-white"><Phone className="size-4" /> Подзвонити</a><a href="https://t.me/PerfectDimLutsk" className="inline-flex h-11 items-center justify-center gap-2 border border-[#173326]/15 text-xs font-semibold"><Send className="size-4" /> Telegram</a><a href="viber://chat?number=%2B380671234567" className="inline-flex h-11 items-center justify-center gap-2 border border-[#173326]/15 text-xs font-semibold"><MessageCircle className="size-4" /> Viber</a><a href="https://wa.me/380671234567" className="col-span-2 inline-flex h-11 items-center justify-center gap-2 border border-[#173326]/15 text-xs font-semibold"><MessageCircle className="size-4" /> WhatsApp</a></div><div className="my-7 border-t border-[#173326]/10" /><ContactForm propertyTitle={property.title} /></aside>
      </section><SiteFooter />
    </main>
  );
}

function Spec({ icon: Icon, value, label }: { icon: typeof Maximize2; value: string; label: string }) {
  return <div className="bg-white p-5"><Icon className="size-5 text-[#b99751]" /><strong className="mt-6 block text-2xl text-[#173326]">{value}</strong><span className="mt-1 block text-xs text-[#647368]">{label}</span></div>;
}
