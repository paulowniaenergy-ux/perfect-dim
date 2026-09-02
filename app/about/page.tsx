import type { Metadata } from 'next';
import { Check, HeartHandshake, Scale, ShieldCheck } from 'lucide-react';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

export const metadata: Metadata = {
  title: 'Про компанію — Perfect Dim',
  description: 'Perfect Dim проєктує та будує будинки й дуплекси біля Луцька.',
};

const stages = [
  'Розмова про ділянку, бюджет і сценарій життя',
  'Планування, фасади та попередня комплектація',
  'Підготовка ділянки й старт будівництва',
  'Конструктив, покрівля та закритий контур',
  'Інженерія, утеплення й фінальні роботи',
  'Передача будинку та документації',
];

export default function AboutPage() {
  return (
    <main className="bg-[#f6f1e8]">
      <SiteHeader />
      <section className="pd-container grid gap-12 py-16 lg:grid-cols-2 lg:items-center lg:py-24">
        <div>
          <p className="pd-eyebrow">Забудовник Perfect Dim</p>
          <h1 className="mt-5 text-5xl leading-[1.02] text-[#173326] sm:text-7xl">Будуємо будинки, у яких рішення можна побачити до заселення</h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-[#5d6e63]">Працюємо з приватними будинками й дуплексами у Луцькому районі: від планування на ділянці до передачі ключів. Пояснюємо комплектацію та фіксуємо етапи робіт.</p>
        </div>
        <img src="/property-2.png" alt="Будинок Perfect Dim" className="aspect-[4/3] w-full object-cover" />
      </section>

      <section className="bg-[#173326] py-20 text-white">
        <div className="pd-container">
          <p className="pd-eyebrow">Як працюємо</p>
          <div className="mt-10 grid gap-px bg-white/12 md:grid-cols-3">
            {[
              [HeartHandshake, 'Проєкт і ділянка', 'Допомагаємо зі сценарієм будинку, посадкою на ділянці та базовими планувальними рішеннями.'],
              [ShieldCheck, 'Будівельний контроль', 'Тримаємо в полі зору конструктив, інженерію, утеплення й ключові вузли на кожному етапі.'],
              [Scale, 'Передача будинку', 'Погоджуємо комплектацію, фінальний обсяг робіт і передаємо документацію разом із ключами.'],
            ].map(([Icon, title, copy]) => {
              const CardIcon = Icon as typeof HeartHandshake;
              return <div key={String(title)} className="bg-[#173326] p-8"><CardIcon className="size-7 text-[#c3a567]" /><h2 className="mt-8 text-3xl">{String(title)}</h2><p className="mt-4 text-sm leading-6 text-white/58">{String(copy)}</p></div>;
            })}
          </div>
        </div>
      </section>

      <section className="pd-container grid gap-12 py-20 lg:grid-cols-[.7fr_1.3fr] lg:py-28">
        <div><p className="pd-eyebrow">Етапи роботи</p><h2 className="mt-4 text-4xl text-[#173326] sm:text-5xl">Від ескізу до готового будинку</h2></div>
        <div className="grid gap-5 sm:grid-cols-2">{stages.map((item) => <p key={item} className="flex items-start gap-3 border-t border-[#173326]/12 pt-4 text-sm leading-6 text-[#52665a]"><Check className="mt-1 size-4 shrink-0 text-[#b99751]" /> {item}</p>)}</div>
      </section>
      <SiteFooter />
    </main>
  );
}
