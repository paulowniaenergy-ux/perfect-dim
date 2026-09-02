import { MessageCircle, Send } from 'lucide-react';
import { Brand } from '@/components/brand';

export function SiteFooter() {
  return (
    <footer className="bg-[#10291f] py-14 text-white">
      <div className="pd-container grid gap-12 lg:grid-cols-[1.4fr_.7fr_.7fr]">
        <div>
          <a href="/" className="flex items-center gap-3">
            <Brand light />
          </a>
          <p className="mt-5 max-w-md text-sm leading-6 text-white/56">
            Проєктуємо та будуємо будинки й дуплекси біля Луцька. Пояснюємо комплектацію, показуємо етапи й тримаємо відповідальність в одній команді.
          </p>
        </div>
        <div className="grid content-start gap-3 text-sm text-white/65">
          <p className="pd-eyebrow mb-2">Навігація</p>
          <a href="/catalog" className="hover:text-white">Каталог</a>
          <a href="/about" className="hover:text-white">Про нас</a>
          <a href="/contacts" className="hover:text-white">Контакти</a>
          <a href="/admin" className="hover:text-white">Адмінка</a>
        </div>
        <div className="grid content-start gap-3 text-sm text-white/65">
          <p className="pd-eyebrow mb-2">Зв’язок</p>
          <a href="tel:+380671234567" className="hover:text-white">+38 067 123 45 67</a>
          <a href="mailto:hello@perfectdim.ua" className="hover:text-white">hello@perfectdim.ua</a>
          <div className="mt-3 flex gap-3">
            <a href="https://t.me/PerfectDimLutsk" aria-label="Telegram" className="grid size-10 place-items-center border border-white/15 hover:border-[#b99751] hover:text-[#d7bd87]"><Send className="size-4" /></a>
            <a href="viber://chat?number=%2B380671234567" aria-label="Viber" className="grid size-10 place-items-center border border-white/15 hover:border-[#b99751] hover:text-[#d7bd87]"><MessageCircle className="size-4" /></a>
          </div>
        </div>
      </div>
      <div className="pd-container mt-12 border-t border-white/10 pt-6 text-xs text-white/35">
        © 2026 Perfect Dim. Демонстраційний локальний сайт.
      </div>
    </footer>
  );
}
