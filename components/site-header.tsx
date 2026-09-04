import { Menu, Phone } from 'lucide-react';
import { Brand } from '@/components/brand';

export function SiteHeader({ inverted = false }: { inverted?: boolean }) {
  const shell = inverted
    ? 'border-white/15 text-white'
    : 'border-[#173326]/12 bg-[#f6f1e8]/95 text-[#173326] backdrop-blur';
  return (
    <header className={`relative z-40 border-b ${shell}`}>
      <div className="pd-container flex h-20 items-center justify-between">
        <a href="/" aria-label="Perfect Dim — головна" className="flex items-center gap-3">
          <Brand light={inverted} />
        </a>
        <nav className="hidden items-center gap-8 text-sm lg:flex" aria-label="Головна навігація">
          <a href="/catalog" className="transition hover:text-[#b99751]">Каталог</a>
          <a href="/articles" className="transition hover:text-[#b99751]">Статті</a>
          <a href="/about" className="transition hover:text-[#b99751]">Про нас</a>
          <a href="/contacts" className="transition hover:text-[#b99751]">Контакти</a>
        </nav>
        <div className="flex items-center gap-3">
          <a href="tel:+380671234567" className="hidden items-center gap-2 border border-current/25 px-4 py-2.5 text-sm transition hover:border-[#b99751] hover:text-[#b99751] sm:flex">
            <Phone className="size-4" /> +38 067 123 45 67
          </a>
          <details className="group relative lg:hidden">
            <summary className="grid size-11 cursor-pointer list-none place-items-center border border-current/25" aria-label="Відкрити меню">
              <Menu className="size-5" />
            </summary>
            <nav className="absolute right-0 top-13 grid min-w-56 gap-1 bg-[#f6f1e8] p-3 text-[#173326] shadow-2xl" aria-label="Мобільна навігація">
              <a href="/catalog" className="px-4 py-3 hover:bg-[#ebe3d4]">Каталог</a>
              <a href="/articles" className="px-4 py-3 hover:bg-[#ebe3d4]">Статті</a>
              <a href="/about" className="px-4 py-3 hover:bg-[#ebe3d4]">Про нас</a>
              <a href="/contacts" className="px-4 py-3 hover:bg-[#ebe3d4]">Контакти</a>
              <a href="tel:+380671234567" className="px-4 py-3 text-[#9a783b]">Зателефонувати</a>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
