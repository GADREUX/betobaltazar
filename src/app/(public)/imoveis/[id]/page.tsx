import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { money } from '@/lib/utils';
import { Bed, Bath, Car, Maximize2, MapPin, ArrowLeft, MessageCircle, Phone, Mail, CheckCircle2 } from 'lucide-react';

export default async function PropertyDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: p } = await supabase.from('properties').select('*').eq('id', params.id).eq('is_published', true).single();
  if (!p) notFound();
  const isRent = p.purpose === 'Locação';
  const price = isRent && p.rent ? `${money(p.rent)}/mês` : money(p.price);
  const photos: string[] = p.photos?.length > 0 ? p.photos : [];
  const waMsg = `Olá Beto! Tenho interesse no imóvel: ${p.title}. Podemos conversar?`;
  return (
    <div className="bg-paper">
      <div className="max-w-7xl mx-auto px-6 md:px-8 pt-6">
        <Link href="/imoveis" className="inline-flex items-center gap-2 text-sm text-ink-soft hover:text-terra transition mb-6"><ArrowLeft size={14} /> Voltar</Link>
      </div>
      <section className="max-w-7xl mx-auto px-6 md:px-8 mb-10">
        {photos.length === 0 ? (
          <div className="aspect-[4/3] md:aspect-[16/9] rounded-2xl md:rounded-3xl bg-cream flex items-center justify-center"><div className="w-24 h-24 bg-terra/20 rounded-2xl flex items-center justify-center"><svg viewBox="0 0 40 40" className="w-12 h-12 text-terra/60" fill="currentColor"><path d="M4 22 L20 6 L36 22 L36 36 L26 36 L26 26 L14 26 L14 36 L4 36 Z" /></svg></div></div>
        ) : (
          <>
            {/* Mobile: foto principal + miniaturas */}
            <div className="md:hidden space-y-2">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                <Image src={photos[0]} alt={p.title} fill className="object-cover" sizes="100vw" priority />
              </div>
              {photos.length > 1 && (
                <div className="grid grid-cols-4 gap-1.5">
                  {photos.slice(1, 5).map((url: string, i: number) => (
                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-cream">
                      <Image src={url} alt={`${p.title} ${i+2}`} fill className="object-cover" sizes="25vw" />
                    </div>
                  ))}
                  {photos.length < 5 && Array.from({ length: Math.min(4, 5 - photos.length) }).map((_, i) => (
                    <div key={`e${i}`} className="aspect-square rounded-xl bg-cream" />
                  ))}
                </div>
              )}
            </div>
            {/* Desktop: grade de 5 fotos */}
            <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-2 rounded-3xl overflow-hidden aspect-[16/9]">
              <div className="col-span-2 row-span-2 relative"><Image src={photos[0]} alt={p.title} fill className="object-cover" sizes="50vw" priority /></div>
              {photos.slice(1, 5).map((url: string, i: number) => (
                <div key={i} className="relative bg-cream"><Image src={url} alt={`${p.title} ${i+2}`} fill className="object-cover" sizes="25vw" /></div>
              ))}
              {photos.length < 5 && Array.from({ length: 5 - photos.length }).map((_, i) => <div key={`e${i}`} className="bg-cream" />)}
            </div>
          </>
        )}
      </section>
      <section className="max-w-7xl mx-auto px-6 md:px-8 pb-20 grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="badge bg-cream border border-border text-ink">{p.purpose}</span>
            <span className="badge bg-cream border border-border text-ink">{p.type}</span>
            {p.is_featured && <span className="badge bg-terra text-white">Destaque</span>}
          </div>
          <h1 className="font-display text-4xl font-bold text-ink mb-3">{p.title}</h1>
          <div className="flex items-center gap-1.5 text-ink-soft/70 mb-8"><MapPin size={15} /><span>{p.address}, {p.neighborhood} — {p.city}/{p.state}</span></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {[{ icon: <Bed size={20} />, label: 'Quartos', value: p.bedrooms || '—' }, { icon: <Bath size={20} />, label: 'Banheiros', value: p.bathrooms }, { icon: <Car size={20} />, label: 'Vagas', value: p.parking }, { icon: <Maximize2 size={20} />, label: 'Área', value: `${p.area}m²` }].map((s, i) => (
              <div key={i} className="bg-white border border-border rounded-xl p-5 text-center">
                <div className="flex justify-center text-terra mb-2">{s.icon}</div>
                <div className="font-display text-2xl font-bold text-ink">{s.value}</div>
                <div className="text-xs text-ink-soft/70 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
          {/* Card de contato visível só no mobile */}
          <div className="lg:hidden mb-10 card-base p-6">
            <p className="text-xs text-ink-soft/60 uppercase tracking-wide mb-1">{isRent ? 'Aluguel' : 'Valor'}</p>
            <div className="font-display text-3xl font-bold text-ink mb-5">{price}</div>
            <h3 className="font-display text-lg font-semibold text-ink mb-1">Tem interesse?</h3>
            <p className="text-sm text-ink-soft/70 mb-4">Fale diretamente com o Beto.</p>
            <a href={`https://wa.me/5515996897738?text=${encodeURIComponent(waMsg)}`} target="_blank" rel="noopener noreferrer" className="w-full btn-primary mb-2 justify-center"><MessageCircle size={16} /> WhatsApp</a>
            <a href="tel:+5515996897738" className="w-full btn-outline mb-2 justify-center"><Phone size={15} /> (15) 99689-7738</a>
            <a href={`mailto:betobaltazar@gmail.com?subject=Interesse: ${p.title}`} className="w-full btn-outline justify-center"><Mail size={15} /> E-mail</a>
            <div className="mt-5 pt-5 border-t border-border text-center">
              <p className="text-[10px] tracking-widest text-terra uppercase font-semibold">CRECI 318284-F</p>
              <p className="text-sm font-display font-semibold text-ink mt-1">Beto Baltazar</p>
            </div>
          </div>
          {p.description && <div className="mb-10"><h2 className="font-display text-2xl font-semibold mb-4">Sobre o imóvel</h2><p className="text-ink-soft/85 leading-relaxed">{p.description}</p></div>}
          {p.features?.length > 0 && (
            <div><h2 className="font-display text-2xl font-semibold mb-4">Características</h2>
              <div className="grid sm:grid-cols-2 gap-2">
                {p.features.map((f: string) => <div key={f} className="flex items-center gap-2 text-sm text-ink-soft py-1.5"><CheckCircle2 size={16} className="text-terra shrink-0" /><span>{f}</span></div>)}
              </div>
            </div>
          )}
        </div>
        <aside className="hidden lg:block lg:col-span-4">
          <div className="sticky top-24 card-base p-7">
            <p className="text-xs text-ink-soft/60 uppercase tracking-wide mb-1">{isRent ? 'Aluguel' : 'Valor'}</p>
            <div className="font-display text-3xl font-bold text-ink mb-5">{price}</div>
            <h3 className="font-display text-lg font-semibold text-ink mb-1">Tem interesse?</h3>
            <p className="text-sm text-ink-soft/70 mb-5">Fale diretamente com o Beto.</p>
            <a href={`https://wa.me/5515996897738?text=${encodeURIComponent(waMsg)}`} target="_blank" rel="noopener noreferrer" className="w-full btn-primary mb-2 justify-center"><MessageCircle size={16} /> WhatsApp</a>
            <a href="tel:+5515996897738" className="w-full btn-outline mb-2 justify-center"><Phone size={15} /> (15) 99689-7738</a>
            <a href={`mailto:betobaltazar@gmail.com?subject=Interesse: ${p.title}`} className="w-full btn-outline justify-center"><Mail size={15} /> E-mail</a>
            <div className="mt-5 pt-5 border-t border-border text-center">
              <p className="text-[10px] tracking-widest text-terra uppercase font-semibold">CRECI 318284-F</p>
              <p className="text-sm font-display font-semibold text-ink mt-1">Beto Baltazar</p>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
