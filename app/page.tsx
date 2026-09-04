import { ArrowRight, Check, MapPin, Phone, Search, ShieldCheck, Sparkles } from 'lucide-react';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { PropertyCard } from '@/components/property-card';
import { getFeaturedProperties, getPublishedProperties } from '@/lib/properties-repository';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const [featuredResult, propertiesResult] = await Promise.all([getFeaturedProperties(), getPublishedProperties()]);
  const featured = featuredResult.ok ? featuredResult.data : [];
  const moreProjects = propertiesResult.ok
    ? propertiesResult.data.filter((property) => !property.featured).slice(0, 2)
    : [];
  return (
    <main className="min-h-screen bg-[#f6f1e8]">
      <section className="relative min-h-[760px] overflow-hidden bg-[#173326] bg-cover bg-center text-white" style={{ backgroundImage: "url('/perfect-dim-hero-neighborhood.png')" }}>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(12,31,23,.96)_0%,rgba(12,31,23,.67)_45%,rgba(12,31,23,.12)_100%)]" />
        <div className="relative z-10"><SiteHeader inverted /></div>
        <div className="pd-container relative z-10 flex min-h-[660px] items-center pb-16 pt-10">
          <div className="max-w-[760px]">
            <p className="pd-eyebrow mb-7">Забудовник · Луцький район</p>
            <h1 className="max-w-[720px] text-5xl font-semibold leading-[.98] tracking-[-0.05em] sm:text-7xl lg:text-[96px]">Будинки під ключ</h1>
            <p className="mt-8 max-w-[570px] text-base leading-7 text-white/72 sm:text-lg">Проєктуємо, будуємо й показуємо комплектацію без дрібного шрифту: конструктив, утеплення, комунікації та готовність кожного будинку.</p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a href="/catalog" className="inline-flex h-14 items-center justify-center gap-3 bg-[#c3a567] px-7 text-sm font-semibold text-[#173326] transition hover:bg-[#d4ba82]">Перейти до каталогу <ArrowRight className="size-4" /></a>
              <a href="/contacts" className="inline-flex h-14 items-center justify-center gap-3 border border-white/25 px-7 text-sm font-semibold transition hover:border-white/60">Запланувати огляд</a>
            </div>
            <div className="mt-16 flex flex-wrap gap-x-10 gap-y-4 border-t border-white/15 pt-6 text-sm text-white/58">
              <span className="flex items-center gap-2"><MapPin className="size-4 text-[#c3a567]" /> До 25 км від Луцька</span><span>Будинки та дуплекси</span><span>Відкрита комплектація</span>
            </div>
          </div>
        </div>
      </section>

      <section className="pd-container py-20 lg:py-28">
        <div className="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div><p className="pd-eyebrow">Будуємо зараз</p><h2 className="mt-4 max-w-2xl text-4xl leading-tight text-[#173326] sm:text-5xl">Проєкти, які можна побачити на ділянці</h2></div>
          <a href="/catalog" className="inline-flex items-center gap-2 text-sm font-semibold text-[#173326] underline decoration-[#b99751] underline-offset-8">Увесь каталог <ArrowRight className="size-4" /></a>
        </div>
        {featured.length > 0 ? <div className="grid gap-6 lg:grid-cols-3">{featured.map((property) => <PropertyCard key={property.id} property={property} />)}</div> : <DataUnavailable message={featuredResult.ok ? 'Опублікованих рекомендованих об’єктів поки немає.' : featuredResult.message} />}
      </section>

      <section className="pd-deep-green-pattern py-20 text-white lg:py-28">
        <div className="pd-container grid gap-14 lg:grid-cols-[.85fr_1.15fr] lg:items-center">
          <div><p className="pd-eyebrow">Підхід Perfect Dim</p><h2 className="mt-5 text-4xl leading-tight sm:text-6xl">Від ділянки до ключів — одна команда</h2><p className="mt-6 max-w-lg leading-7 text-white/62">Починаємо з планування та інженерії, контролюємо ключові етапи будівництва і передаємо будинок із зафіксованою комплектацією.</p><a href="/about" className="mt-8 inline-flex items-center gap-2 border-b border-[#c3a567] pb-2 text-sm font-semibold text-[#d7bd87]">Про підхід <ArrowRight className="size-4" /></a></div>
          <div className="grid gap-px bg-white/12 sm:grid-cols-3">
            {[[ShieldCheck, 'Конструктив', 'Пояснюємо, з чого зведені стіни, як утеплено фасад і що закладено в основі будинку.'], [Search, 'Інженерія', 'Показуємо рішення для електрики, води, опалення та вентиляції до завершення робіт.'], [Sparkles, 'Готовність', 'Фіксуємо комплектацію, строки та наступний етап — без нечітких обіцянок.']].map(([Icon, title, copy]) => (
              <div key={String(title)} className="pd-deep-green-pattern-panel p-7 sm:min-h-64"><Icon className="size-7 text-[#c3a567]" /><h3 className="mt-8 text-2xl">{String(title)}</h3><p className="mt-4 text-sm leading-6 text-white/55">{String(copy)}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="pd-container py-20 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-[.65fr_1.35fr]">
          <div><p className="pd-eyebrow">Ще проєкти</p><h2 className="mt-4 text-4xl leading-tight text-[#173326] sm:text-5xl">Будинки в інших локаціях</h2><p className="mt-5 max-w-sm leading-7 text-[#647368]">Ще кілька форматів будинків із нашої добірки — з площею, ділянкою та орієнтовною вартістю.</p><div className="mt-8 space-y-3 text-sm text-[#52665a]">{['Одноповерхові будинки й дуплекси', 'Площі від 104 до 138 м²', 'Локації біля Луцька'].map((item) => <p key={item} className="flex gap-2"><Check className="size-4 text-[#b99751]" /> {item}</p>)}</div></div>
          {moreProjects.length > 0 ? <div className="grid gap-6 sm:grid-cols-2">{moreProjects.map((property) => <PropertyCard key={property.id} property={property} />)}</div> : <DataUnavailable message={propertiesResult.ok ? 'Нові проєкти готуються до публікації.' : propertiesResult.message} />}
        </div>
      </section>

      <section className="bg-[#e8dec9] py-16"><div className="pd-container flex flex-col justify-between gap-8 lg:flex-row lg:items-center"><div><p className="pd-eyebrow">Своя ділянка?</p><h2 className="mt-3 text-4xl text-[#173326] sm:text-5xl">Обговорімо формат будинку та бюджет будівництва</h2></div><div className="flex flex-col gap-3 sm:flex-row"><a href="tel:+380671234567" className="inline-flex h-14 items-center justify-center gap-2 bg-[#173326] px-7 text-sm font-semibold text-white"><Phone className="size-4" /> Подзвонити</a><a href="/contacts" className="inline-flex h-14 items-center justify-center border border-[#173326]/25 px-7 text-sm font-semibold text-[#173326]">Запланувати розмову</a></div></div></section>
      <SiteFooter />
    </main>
  );
}

function DataUnavailable({ message }: { message: string }) {
  return <div className="grid min-h-56 place-items-center border border-[#173326]/10 bg-white/35 px-6 text-center text-sm leading-6 text-[#647368]">{message}</div>;
}
