export function Brand({ light = false }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-3">
      {/* Замініть цей блок на <img src="/logo.svg" ... /> після отримання логотипа. */}
      <span className="grid size-10 place-items-center border border-[#b99751] font-heading text-xl italic text-[#b99751]">PD</span>
      <span className={`font-heading text-2xl tracking-wide ${light ? 'text-white' : 'text-[#173326]'}`}>Perfect Dim</span>
    </span>
  );
}
