import { ArrowRight, Check, MapPin, Phone, Search, ShieldCheck, Sparkles } from 'lucide-react';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { PropertyCard } from '@/components/property-card';
import { getFeaturedProperties, getSoldProperties } from '@/lib/properties-repository';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const [featuredResult, soldResult] = await Promise.all([getFeaturedProperties(), getSoldProperties()]);
  const featured = featuredResult.ok ? featuredResult.data : [];
  const sold = soldResult.ok ? soldResult.data : [];
  return (
    <main className="min-h-screen bg-[#f6f1e8]">
      <section className="relative min-h-[760px] overflow-hidden bg-[#173326] bg-cover bg-center text-white" style={{ backgroundImage: "url('/perfect-dim-hero-neighborhood.png')" }}>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(12,31,23,.96)_0%,rgba(12,31,23,.67)_45%,rgba(12,31,23,.12)_100%)]" />
        <div className="relative z-10"><SiteHeader inverted /></div>
        <div className="pd-container relative z-10 flex min-h-[660px] items-center pb-16 pt-10">
          <div className="max-w-[760px]">
            <p className="pd-eyebrow mb-7">Продаж будинків біля Луцька</p>
            <h1 className="max-w-[720px] text-5xl leading-[.98] tracking-[-0.035em] sm:text-7xl lg:text-[96px]">Будинки, які можна перевірити й переглянути</h1>
            <p className="mt-8 max-w-[570px] text-base leading-7 text-white/72 sm:text-lg">У каталозі є ціна, площа, ділянка, статус і відстань до Луцька. Перед завдатком перевіряємо документи та пояснюємо умови угоди.</p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a href="/catalog" className="inline-flex h-14 items-center justify-center gap-3 bg-[#c3a567] px-7 text-sm font-semibold text-[#173326] transition hover:bg-[#d4ba82]">Перейти до каталогу <ArrowRight className="size-4" /></a>
              <a href="/contacts" className="inline-flex h-14 items-center justify-center gap-3 border border-white/25 px-7 text-sm font-semibold transition hover:border-white/60">Обговорити пошук</a>
            </div>
            <div className="mt-16 flex flex-wrap gap-x-10 gap-y-4 border-t border-white/15 pt-6 text-sm text-white/58">
              <span className="flex items-center gap-2"><MapPin className="size-4 text-[#c3a567]" /> До 25 км від Луцька</span><span>20 демонстраційних пропозицій</span><span>Перевірені документи</span>
            </div>
          </div>
        </div>
      </section>

      <section className="pd-container py-20 lg:py-28">
        <div className="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div><p className="pd-eyebrow">Актуальні пропозиції</p><h2 className="mt-4 max-w-2xl text-4xl leading-tight text-[#173326] sm:text-5xl">Будинки, доступні для перегляду</h2></div>
          <a href="/catalog" className="inline-flex items-center gap-2 text-sm font-semibold text-[#173326] underline decoration-[#b99751] underline-offset-8">Увесь каталог <ArrowRight className="size-4" /></a>
        </div>
        {featured.length > 0 ? <div className="grid gap-6 lg:grid-cols-3">{featured.map((property) => <PropertyCard key={property.id} property={property} />)}</div> : <DataUnavailable message={featuredResult.ok ? 'Опублікованих рекомендованих об’єктів поки немає.' : featuredResult.message} />}
      </section>

      <section className="bg-[#173326] py-20 text-white lg:py-28">
        <div className="pd-container grid gap-14 lg:grid-cols-[.85fr_1.15fr] lg:items-center">
          <div><p className="pd-eyebrow">Як відбираємо</p><h2 className="mt-5 text-4xl leading-tight sm:text-6xl">Відсіюємо невідповідні варіанти до перегляду</h2><p className="mt-6 max-w-lg leading-7 text-white/62">Звіряємо бюджет, площу, ділянку, стан ремонту й маршрут до Луцька. На перегляд залишаємо будинки, що відповідають цим критеріям.</p><a href="/about" className="mt-8 inline-flex items-center gap-2 border-b border-[#c3a567] pb-2 text-sm font-semibold text-[#d7bd87]">Як ми працюємо <ArrowRight className="size-4" /></a></div>
          <div className="grid gap-px bg-white/12 sm:grid-cols-3">
            {[[ShieldCheck, 'Юридична перевірка', 'Аналізуємо право власності, землю та обмеження до завдатку.'], [Search, 'Точний відбір', 'Економимо ваш час і показуємо лише релевантні варіанти.'], [Sparkles, 'Супровід до ключів', 'Переговори, документи й фінальна передача — в одних руках.']].map(([Icon, title, copy]) => (
              <div key={String(title)} className="bg-[#173326] p-7 sm:min-h-64"><Icon className="size-7 text-[#c3a567]" /><h3 className="mt-8 text-2xl">{String(title)}</h3><p className="mt-4 text-sm leading-6 text-white/55">{String(copy)}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="pd-container py-20 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-[.65fr_1.35fr]">
          <div><p className="pd-eyebrow">Продані об’єкти</p><h2 className="mt-4 text-4xl leading-tight text-[#173326] sm:text-5xl">Будинки, які вже знайшли покупців</h2><p className="mt-5 max-w-sm leading-7 text-[#647368]">Не прибираємо їх із каталогу: так можна побачити реальні типи будинків, локації та ціновий діапазон наших угод.</p><div className="mt-8 space-y-3 text-sm text-[#52665a]">{['Оцінка ціни на основі ринкових аналогів', 'Фото, характеристики та зрозумілий опис', 'Переговори й перевірка документів'].map((item) => <p key={item} className="flex gap-2"><Check className="size-4 text-[#b99751]" /> {item}</p>)}</div></div>
          {sold.length > 0 ? <div className="grid gap-6 sm:grid-cols-2">{sold.map((property) => <PropertyCard key={property.id} property={property} />)}</div> : <DataUnavailable message={soldResult.ok ? 'Опублікованих проданих об’єктів поки немає.' : soldResult.message} />}
        </div>
      </section>

      <section className="bg-[#e8dec9] py-16"><div className="pd-container flex flex-col justify-between gap-8 lg:flex-row lg:items-center"><div><p className="pd-eyebrow">Потрібен інший варіант?</p><h2 className="mt-3 text-4xl text-[#173326] sm:text-5xl">Назвіть бюджет, площу й бажану локацію</h2></div><div className="flex flex-col gap-3 sm:flex-row"><a href="tel:+380671234567" className="inline-flex h-14 items-center justify-center gap-2 bg-[#173326] px-7 text-sm font-semibold text-white"><Phone className="size-4" /> Подзвонити</a><a href="/contacts" className="inline-flex h-14 items-center justify-center border border-[#173326]/25 px-7 text-sm font-semibold text-[#173326]">Залишити заявку</a></div></div></section>
      <SiteFooter />
    </main>
  );
}

function DataUnavailable({ message }: { message: string }) {
  return <div className="grid min-h-56 place-items-center border border-[#173326]/10 bg-white/35 px-6 text-center text-sm leading-6 text-[#647368]">{message}</div>;
}
