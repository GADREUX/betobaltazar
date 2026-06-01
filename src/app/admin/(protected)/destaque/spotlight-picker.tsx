'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Star, Loader2, Search } from 'lucide-react';
import { money } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function SpotlightPicker({ properties, currentId }: { properties: any[]; currentId: string | null }) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const filtered = search
    ? properties.filter(p => p.title.toLowerCase().includes(search.toLowerCase()) || (p.neighborhood || '').toLowerCase().includes(search.toLowerCase()))
    : properties;

  async function setSpotlight(id: string) {
    if (id === currentId) return;
    setLoading(id);
    const supabase = createClient();
    if (currentId) {
      await supabase.from('properties').update({ is_featured: false }).eq('id', currentId);
    }
    const { error } = await supabase.from('properties').update({ is_featured: true }).eq('id', id);
    if (error) {
      toast.error('Erro ao definir destaque');
      setLoading(null);
      return;
    }
    toast.success('Imóvel da Vez atualizado!');
    router.refresh();
    setLoading(null);
  }

  async function removeSpotlight() {
    if (!currentId) return;
    setLoading('remove');
    const supabase = createClient();
    await supabase.from('properties').update({ is_featured: false }).eq('id', currentId);
    toast.success('Destaque removido');
    router.refresh();
    setLoading(null);
  }

  return (
    <div className="space-y-6">
      {currentId && (
        <div className="flex justify-end">
          <button onClick={removeSpotlight} disabled={loading === 'remove'} className="btn-outline text-sm">
            {loading === 'remove' ? <Loader2 size={14} className="animate-spin" /> : null}
            Remover destaque
          </button>
        </div>
      )}

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft/40" />
        <input
          className="field-input pl-10"
          placeholder="Buscar imóvel por título ou bairro..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((p: any) => {
          const isCurrent = p.id === currentId;
          const isRent = p.purpose === 'Locação';
          const price = isRent && p.rent ? `${money(p.rent)}/mês` : money(p.price);
          return (
            <div key={p.id} className={`card-base overflow-hidden transition-all ${isCurrent ? 'ring-2 ring-terra shadow-terra/20' : ''}`}>
              <div className="relative aspect-[16/10] bg-cream overflow-hidden">
                {p.photos?.[0] ? (
                  <Image src={p.photos[0]} alt={p.title} fill className="object-cover" sizes="(max-width:768px) 100vw, 33vw" unoptimized />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg viewBox="0 0 40 40" className="w-10 h-10 text-terra/30" fill="currentColor"><path d="M4 22 L20 6 L36 22 L36 36 L26 36 L26 26 L14 26 L14 36 L4 36 Z" /></svg>
                  </div>
                )}
                {isCurrent && (
                  <div className="absolute top-2 left-2">
                    <span className="inline-flex items-center gap-1 bg-terra text-white text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full">
                      <Star size={10} fill="currentColor" /> IMÓVEL DA VEZ
                    </span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <p className="text-[10px] font-semibold tracking-widest text-terra mb-1">{(p.neighborhood || '').toUpperCase()}</p>
                <h4 className="font-display text-sm font-bold text-ink mb-1 line-clamp-1">{p.title}</h4>
                <p className="font-display text-lg font-bold text-terra mb-3">{price}</p>
                <button
                  onClick={() => setSpotlight(p.id)}
                  disabled={isCurrent || !!loading}
                  className={`w-full text-sm font-medium py-2 px-4 rounded-lg transition ${isCurrent ? 'bg-terra/10 text-terra cursor-default' : 'btn-primary justify-center'}`}
                >
                  {loading === p.id ? <Loader2 size={14} className="animate-spin mx-auto" /> : isCurrent ? 'Destaque atual' : 'Definir como Imóvel da Vez'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="card-base p-12 text-center">
          <p className="text-sm text-ink-soft/60">Nenhum imóvel encontrado.</p>
        </div>
      )}
    </div>
  );
}
