import { ArrowRight, Check, MapPin, Phone, Search, ShieldCheck, Sparkles } from 'lucide-react';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { PropertyCard } from '@/components/property-card';
import { properties } from '@/lib/properties';

export default function Home() {
  const featured = properties.filter((property) => property.featured && property.status !== 'sold').slice(0, 3);
  const sold = properties.filter((property) => property.status === 'sold').slice(0, 2);
  return (
    <main className="min-h-screen bg-[#f6f1e8]">
      <section className="relative min-h-[760px] overflow-hidden bg-[#173326] bg-cover bg-center text-white" style={{ backgroundImage: "url('/property-hero.png')" }}>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(12,31,23,.96)_0%,rgba(12,31,23,.67)_45%,rgba(12,31,23,.12)_100%)]" />
        <div className="relative z-10"><SiteHeader inverted /></div>
        <div className="pd-container relative z-10 flex min-h-[660px] items-center pb-16 pt-10">
          <div className="max-w-[760px]">
            <p className="pd-eyebrow mb-7">Нерухомість біля Луцька</p>
            <h1 className="max-w-[720px] text-5xl leading-[.98] tracking-[-0.035em] sm:text-7xl lg:text-[96px]">Дім, у якому починається ваше завтра</h1>
            <p className="mt-8 max-w-[570px] text-base leading-7 text-white/72 sm:text-lg">Добірні будинки у спокійних локаціях поруч із містом. Перевіряємо кожен об’єкт і супроводжуємо угоду до ключів.</p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a href="/catalog" className="inline-flex h-14 items-center justify-center gap-3 bg-[#c3a567] px-7 text-sm font-semibold text-[#173326] transition hover:bg-[#d4ba82]">Переглянути будинки <ArrowRight className="size-4" /></a>
              <a href="/contacts" className="inline-flex h-14 items-center justify-center gap-3 border border-white/25 px-7 text-sm font-semibold transition hover:border-white/60">Безкоштовна консультація</a>
            </div>
            <div className="mt-16 flex flex-wrap gap-x-10 gap-y-4 border-t border-white/15 pt-6 text-sm text-white/58">
              <span className="flex items-center gap-2"><MapPin className="size-4 text-[#c3a567]" /> До 25 км від Луцька</span><span>20 демонстраційних пропозицій</span><span>Перевірені документи</span>
            </div>
          </div>
        </div>
      </section>

      <section className="pd-container py-20 lg:py-28">
        <div className="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div><p className="pd-eyebrow">Добірка Perfect Dim</p><h2 className="mt-4 max-w-2xl text-4xl leading-tight text-[#173326] sm:text-5xl">Будинки, варті вашої уваги</h2></div>
          <a href="/catalog" className="inline-flex items-center gap-2 text-sm font-semibold text-[#173326] underline decoration-[#b99751] underline-offset-8">Увесь каталог <ArrowRight className="size-4" /></a>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">{featured.map((property) => <PropertyCard key={property.id} property={property} />)}</div>
      </section>

      <section className="bg-[#173326] py-20 text-white lg:py-28">
        <div className="pd-container grid gap-14 lg:grid-cols-[.85fr_1.15fr] lg:items-center">
          <div><p className="pd-eyebrow">Чому Perfect Dim</p><h2 className="mt-5 text-4xl leading-tight sm:text-6xl">Менше пошуку. Більше впевненості.</h2><p className="mt-6 max-w-lg leading-7 text-white/62">Ми не показуємо все підряд. Спочатку слухаємо, потім відбираємо будинки, які справді відповідають вашому ритму життя.</p><a href="/about" className="mt-8 inline-flex items-center gap-2 border-b border-[#c3a567] pb-2 text-sm font-semibold text-[#d7bd87]">Дізнатися про нас <ArrowRight className="size-4" /></a></div>
          <div className="grid gap-px bg-white/12 sm:grid-cols-3">
            {[[ShieldCheck, 'Юридична перевірка', 'Аналізуємо право власності, землю та обмеження до завдатку.'], [Search, 'Точний відбір', 'Економимо ваш час і показуємо лише релевантні варіанти.'], [Sparkles, 'Супровід до ключів', 'Переговори, документи й фінальна передача — в одних руках.']].map(([Icon, title, copy]) => (
              <div key={String(title)} className="bg-[#173326] p-7 sm:min-h-64"><Icon className="size-7 text-[#c3a567]" /><h3 className="mt-8 text-2xl">{String(title)}</h3><p className="mt-4 text-sm leading-6 text-white/55">{String(copy)}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="pd-container py-20 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-[.65fr_1.35fr]">
          <div><p className="pd-eyebrow">Наші результати</p><h2 className="mt-4 text-4xl leading-tight text-[#173326] sm:text-5xl">Продані з турботою</h2><p className="mt-5 max-w-sm leading-7 text-[#647368]">Продані об’єкти залишаються в каталозі як приклади успішних угод та нашої експертизи.</p><div className="mt-8 space-y-3 text-sm text-[#52665a]">{['Чесна оцінка ринкової ціни', 'Професійна презентація об’єкта', 'Супровід переговорів і угоди'].map((item) => <p key={item} className="flex gap-2"><Check className="size-4 text-[#b99751]" /> {item}</p>)}</div></div>
          <div className="grid gap-6 sm:grid-cols-2">{sold.map((property) => <PropertyCard key={property.id} property={property} />)}</div>
        </div>
      </section>

      <section className="bg-[#e8dec9] py-16"><div className="pd-container flex flex-col justify-between gap-8 lg:flex-row lg:items-center"><div><p className="pd-eyebrow">Почнімо розмову</p><h2 className="mt-3 text-4xl text-[#173326] sm:text-5xl">Розкажіть, який дім ви шукаєте</h2></div><div className="flex flex-col gap-3 sm:flex-row"><a href="tel:+380671234567" className="inline-flex h-14 items-center justify-center gap-2 bg-[#173326] px-7 text-sm font-semibold text-white"><Phone className="size-4" /> Подзвонити</a><a href="/contacts" className="inline-flex h-14 items-center justify-center border border-[#173326]/25 px-7 text-sm font-semibold text-[#173326]">Залишити заявку</a></div></div></section>
      <SiteFooter />
    </main>
  );
}
