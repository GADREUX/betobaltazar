import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import Image from 'next/image';
import { money } from '@/lib/utils';
import { MapPin, Bed, Bath, Car, Maximize2 } from 'lucide-react';
export const revalidate = 60;
export default async function ImoveisPage({ searchParams }: { searchParams: { purpose?: string; type?: string } }) {
  const supabase = createClient();
  let query = supabase.from('properties').select('*').eq('is_published', true).order('is_featured', { ascending: false }).order('created_at', { ascending: false });
  if (searchParams.purpose && searchParams.purpose !== 'Todos') query = query.eq('purpose', searchParams.purpose);
  if (searchParams.type && searchParams.type !== 'Todos') query = query.eq('type', searchParams.type);
  const { data: properties } = await query;
  return (
    <div className="bg-paper min-h-screen">
      <section className="bg-cream/40 border-b border-border">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-12">
          <p className="text-xs tracking-[4px] text-terra uppercase mb-2 font-semibold">Nossa carteira</p>
          <h1 className="font-display text-4xl font-bold text-ink">Imóveis disponíveis.</h1>
        </div>
      </section>
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-12">
        <div className="flex gap-3 mb-8 flex-wrap">
          {['Todos','Venda','Locação'].map(p => (
            <Link key={p} href={p === 'Todos' ? '/imoveis' : `/imoveis?purpose=${p}`}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${searchParams.purpose === p || (!searchParams.purpose && p === 'Todos') ? 'bg-terra text-white border-terra' : 'bg-white border-border text-ink hover:border-terra'}`}>
              {p}
            </Link>
          ))}
        </div>
        {!properties?.length ? (
          <div className="text-center py-20 text-ink-soft/60">Nenhum imóvel encontrado.</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((p: any) => {
              const isRent = p.purpose === 'Locação';
              const price = isRent && p.rent ? `${money(p.rent)}/mês` : money(p.price);
              const photo = p.photos?.[0];
              return (
                <Link key={p.id} href={`/imoveis/${p.id}`} className="group block">
                  <div className="relative overflow-hidden rounded-2xl bg-cream aspect-[4/3] mb-4">
                    {photo ? <Image src={photo} alt={p.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="33vw" /> : <div className="absolute inset-0 bg-cream flex items-center justify-center"><div className="w-12 h-12 bg-terra/20 rounded-lg flex items-center justify-center"><svg viewBox="0 0 40 40" className="w-6 h-6 text-terra/60" fill="currentColor"><path d="M4 22 L20 6 L36 22 L36 36 L26 36 L26 26 L14 26 L14 36 L4 36 Z" /></svg></div></div>}
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      <span className="badge bg-white text-ink shadow-soft">{p.purpose}</span>
                      {p.is_featured && <span className="badge bg-terra text-white">Destaque</span>}
                    </div>
                  </div>
                  <div className="px-1">
                    <div className="flex items-center gap-1 text-xs text-ink-soft/60 mb-1"><MapPin size={11} /><span>{p.neighborhood}, {p.city}</span></div>
                    <h3 className="font-display text-lg font-semibold text-ink group-hover:text-terra transition line-clamp-2 mb-2">{p.title}</h3>
                    <div className="font-display text-xl font-bold text-ink mb-3">{price}</div>
                    <div className="flex items-center gap-3 text-xs text-ink-soft/70 pt-3 border-t border-border">
                      {p.bedrooms > 0 && <span className="flex items-center gap-1"><Bed size={13} /> {p.bedrooms}</span>}
                      <span className="flex items-center gap-1"><Bath size={13} /> {p.bathrooms}</span>
                      <span className="flex items-center gap-1"><Car size={13} /> {p.parking}</span>
                      <span className="flex items-center gap-1 ml-auto"><Maximize2 size={13} /> {p.area}m²</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
