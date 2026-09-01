import { ArrowUpRight, BedDouble, LandPlot, MapPin, Maximize2 } from 'lucide-react';
import { coverImage, formatPrice, statusLabels, type Property } from '@/lib/property-types';

const statusClass = {
  available: 'bg-[#173326] text-white',
  reserved: 'bg-[#c3a567] text-[#173326]',
  sold: 'bg-[#9b352d] text-white',
};

export function PropertyCard({ property }: { property: Property }) {
  const cover = coverImage(property);
  return (
    <article className="group overflow-hidden bg-[#fffdf8] shadow-[0_16px_50px_rgba(23,51,38,.07)]">
      <a href={`/property/${property.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-[#d8d0c0]">
        <img
          src={cover?.url || '/property-hero.png'}
          alt={cover?.altText || `${property.title}, ${property.location}`}
          className={`h-full w-full object-cover transition duration-700 group-hover:scale-[1.035] ${property.status === 'sold' ? 'saturate-[.72]' : ''}`}
        />
        <span className={`absolute left-4 top-4 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[.15em] ${statusClass[property.status]}`}>
          {statusLabels[property.status]}
        </span>
        {property.status === 'sold' && (
          <span className="absolute inset-x-0 bottom-0 bg-[#7b2e28]/92 px-4 py-3 text-center text-xs font-semibold uppercase tracking-[.18em] text-white">
            Успішно продано Perfect Dim
          </span>
        )}
      </a>
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-1.5 text-xs text-[#647368]"><MapPin className="size-3.5 text-[#b99751]" /> {property.location}{property.distance != null ? ` · ${property.distance} км від Луцька` : ''}</div>
            <h3 className="text-2xl leading-tight text-[#173326]">{property.title}</h3>
          </div>
          <ArrowUpRight className="mt-1 size-5 shrink-0 text-[#b99751] transition group-hover:translate-x-1 group-hover:-translate-y-1" />
        </div>
        <p className="mt-4 text-xl font-semibold text-[#173326]">{formatPrice(property.price, property.currency)}</p>
        <div className="mt-5 grid grid-cols-3 gap-2 border-t border-[#173326]/10 pt-4 text-xs text-[#52665a]">
          <span className="flex items-center gap-1.5"><Maximize2 className="size-3.5" /> {property.houseArea} м²</span>
          <span className="flex items-center gap-1.5"><BedDouble className="size-3.5" /> {property.rooms} кімн.</span>
          <span className="flex items-center gap-1.5"><LandPlot className="size-3.5" /> {property.landArea} сот.</span>
        </div>
      </div>
    </article>
  );
}
