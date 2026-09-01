import type { Metadata } from 'next';
import { Clock3, Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { ContactForm } from '@/components/contact-form';

export const metadata: Metadata = { title: 'Контакти — Perfect Dim', description: 'Зв’яжіться з Perfect Dim щодо купівлі або продажу будинку біля Луцька.' };

export default function ContactsPage() {
  return <main className="bg-[#f6f1e8]"><SiteHeader /><section className="pd-container grid gap-14 py-16 lg:grid-cols-[.9fr_1.1fr] lg:py-24"><div><p className="pd-eyebrow">Контакти</p><h1 className="mt-5 text-5xl leading-none text-[#173326] sm:text-7xl">Поговорімо про ваш майбутній дім</h1><p className="mt-6 max-w-lg leading-7 text-[#617066]">Зателефонуйте або залиште заявку. Ми уточнимо ваші побажання та запропонуємо наступний крок без тиску.</p><div className="mt-10 grid gap-4"><ContactLine icon={Phone} title="Телефон" value="+38 067 123 45 67" href="tel:+380671234567" /><ContactLine icon={Mail} title="Електронна пошта" value="hello@perfectdim.ua" href="mailto:hello@perfectdim.ua" /><ContactLine icon={MapPin} title="Офіс" value="м. Луцьк, просп. Волі, 18" /><ContactLine icon={Clock3} title="Графік" value="Пн–Сб, 09:00–19:00" /></div><div className="mt-8 flex gap-3"><a href="https://t.me/PerfectDimLutsk" className="inline-flex h-11 items-center gap-2 border border-[#173326]/20 px-4 text-sm"><Send className="size-4" /> Telegram</a><a href="viber://chat?number=%2B380671234567" className="inline-flex h-11 items-center gap-2 border border-[#173326]/20 px-4 text-sm"><MessageCircle className="size-4" /> Viber</a></div></div><div className="bg-[#e8dec9] p-6 sm:p-10"><p className="pd-eyebrow">Коротка заявка</p><h2 className="mb-8 mt-3 text-4xl text-[#173326]">Ми вам передзвонимо</h2><ContactForm /></div></section><SiteFooter /></main>;
}

function ContactLine({ icon: Icon, title, value, href }: { icon: typeof Phone; title: string; value: string; href?: string }) {
  const content = <><Icon className="size-5 text-[#b99751]" /><span><small className="block text-[10px] font-semibold uppercase tracking-[.15em] text-[#7d8a81]">{title}</small><strong className="mt-1 block text-base font-medium text-[#173326]">{value}</strong></span></>;
  return href ? <a href={href} className="flex items-center gap-4 border-b border-[#173326]/10 pb-4">{content}</a> : <div className="flex items-center gap-4 border-b border-[#173326]/10 pb-4">{content}</div>;
}
