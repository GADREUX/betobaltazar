import { createClient } from '@/lib/supabase/server';
import { money } from '@/lib/utils';
import Image from 'next/image';
import { Star, Bed, Bath, Maximize2 } from 'lucide-react';
import SpotlightPicker from './spotlight-picker';

export const dynamic = 'force-dynamic';

export default async function DestaquePage() {
  const supabase = createClient();
  const [{ data: spotlight }, { data: properties }] = await Promise.all([
    supabase.from('properties').select('*').eq('is_published', true).eq('is_featured', true).limit(1).single(),
    supabase.from('properties').select('id, title, neighborhood, city, purpose, price, rent, photos, bedrooms, bathrooms, area').eq('is_published', true).order('created_at', { ascending: false }),
  ]);

  const props = properties || [];

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs tracking-widest text-terra uppercase font-semibold mb-1">Homepage</p>
        <h2 className="font-display text-2xl font-bold text-ink">Imóvel da Vez</h2>
        <p className="text-sm text-ink-soft/60 mt-0.5">Escolha qual imóvel aparece em destaque na página inicial.</p>
      </div>

      {spotlight ? (
        <div className="card-base overflow-hidden">
          <div className="grid md:grid-cols-[280px_1fr] gap-0">
            <div className="relative aspect-[4/3] md:aspect-auto bg-cream overflow-hidden">
              {spotlight.photos?.[0] ? (
                <Image src={spotlight.photos[0]} alt={spotlight.title} fill className="object-cover" sizes="280px" unoptimized />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-cream">
                  <svg viewBox="0 0 40 40" className="w-14 h-14 text-terra/30" fill="currentColor"><path d="M4 22 L20 6 L36 22 L36 36 L26 36 L26 26 L14 26 L14 36 L4 36 Z" /></svg>
                </div>
              )}
              <div className="absolute top-3 left-3">
                <span className="inline-flex items-center gap-1.5 bg-terra text-white text-[10px] font-bold tracking-wider px-3 py-1.5 rounded-full shadow-terra">
                  <Star size={11} fill="currentColor" /> IMÓVEL DA VEZ
                </span>
              </div>
            </div>
            <div className="p-6 flex flex-col justify-center">
              <p className="text-[10px] font-semibold tracking-widest text-terra mb-1">{(spotlight.neighborhood || '').toUpperCase()} · {(spotlight.city || '').toUpperCase()}</p>
              <h3 className="font-display text-2xl font-bold text-ink mb-2">{spotlight.title}</h3>
              <div className="flex items-center gap-4 text-sm text-ink-soft/60 mb-4">
                {spotlight.bedrooms > 0 && <span className="flex items-center gap-1"><Bed size={14} /> {spotlight.bedrooms} quartos</span>}
                {spotlight.bathrooms > 0 && <span className="flex items-center gap-1"><Bath size={14} /> {spotlight.bathrooms} banheiros</span>}
                {spotlight.area > 0 && <span className="flex items-center gap-1"><Maximize2 size={14} /> {spotlight.area}m²</span>}
              </div>
              <div className="font-display text-3xl font-bold text-terra">
                {spotlight.purpose === 'Locação' && spotlight.rent ? `${money(spotlight.rent)}/mês` : money(spotlight.price)}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="card-base p-12 text-center">
          <Star size={36} className="text-ink-soft/20 mx-auto mb-3" />
          <h3 className="font-display text-lg font-semibold text-ink mb-1">Nenhum destaque definido</h3>
          <p className="text-sm text-ink-soft/60">Escolha um imóvel abaixo para destacar na página inicial.</p>
        </div>
      )}

      <div>
        <h3 className="font-display text-lg font-semibold text-ink mb-4">Escolher imóvel</h3>
        <SpotlightPicker properties={props} currentId={spotlight?.id || null} />
      </div>
    </div>
  );
}
