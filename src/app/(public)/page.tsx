import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import { money } from '@/lib/utils';
import { ArrowRight, Search, MapPin, Bed, Bath, Car, Maximize2, Award, Shield, Heart, MessageCircle } from 'lucide-react';

export const revalidate = 60;

export default async function HomePage() {
  const supabase = createClient();
  const { data: featured } = await supabase.from('properties').select('*').eq('is_published', true).eq('is_featured', true).limit(6);
  const { count: totalProps } = await supabase.from('properties').select('*', { count: 'exact', head: true }).eq('is_published', true);

  return (
    <div className="bg-paper">
      {/* HERO */}
      <section className="relative overflow-hidden bg-white border-b border-border">
        <div className="absolute top-0 right-0 w-[600px] h-full bg-terra/5 clip-diagonal pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-16 md:py-24 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-terra/10 border border-terra/20 rounded-full px-4 py-1.5 mb-6">
                <div className="w-2 h-2 rounded-full bg-terra" />
                <span className="text-xs font-semibold text-terra tracking-wide">Capão Bonito · SP</span>
              </div>
              <h1 className="font-display font-bold text-ink leading-[1.05] tracking-tight text-5xl md:text-6xl mb-6">
                Encontre o imóvel<br />
                <span className="text-terra">certo para você.</span>
              </h1>
              <p className="text-lg text-ink-soft/80 max-w-xl mb-10 leading-relaxed">
                Corretor de imóveis em Capão Bonito com mais de 15 anos de experiência. Compra, venda e locação com transparência e dedicação.
              </p>
              <div className="flex flex-wrap gap-3 mb-12">
                <Link href="/imoveis" className="btn-primary btn-lg group">
                  <Search size={16} /> Ver Imóveis <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </Link>
                <Link href="/anuncie" className="btn-outline btn-lg">Anunciar meu imóvel</Link>
              </div>
              <div className="flex gap-8 pt-8 border-t border-border">
                <div><div className="font-display text-3xl font-bold text-ink">{totalProps ?? 0}+</div><div className="text-xs text-ink-soft/60 mt-1">Imóveis na carteira</div></div>
                <div><div className="font-display text-3xl font-bold text-ink">15+</div><div className="text-xs text-ink-soft/60 mt-1">Anos de experiência</div></div>
                <div><div className="font-display text-3xl font-bold text-terra">CRECI</div><div className="text-xs text-ink-soft/60 mt-1">318284-F</div></div>
              </div>
            </div>
            <div className="hidden lg:flex items-center justify-center">
              <div className="relative w-full max-w-md aspect-square">
                <div className="absolute inset-0 bg-terra/10 rounded-3xl rotate-3" />
                <div className="absolute inset-0 bg-cream border border-border rounded-3xl -rotate-1 flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="w-24 h-24 bg-terra rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <svg viewBox="0 0 40 40" className="w-14 h-14 text-white" fill="currentColor">
                        <path d="M4 22 L20 6 L36 22 L36 36 L26 36 L26 26 L14 26 L14 36 L4 36 Z" />
                      </svg>
                    </div>
                    <div className="font-display text-2xl font-bold text-ink mb-1">Beto Baltazar</div>
                    <div className="text-sm text-ink-soft/70">Corretor de Imóveis</div>
                    <div className="text-xs text-terra font-semibold mt-2 tracking-wider">CRECI 318284-F</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALORES */}
      <section className="py-20 bg-cream/40 border-y border-border">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="text-center mb-12">
            <p className="text-xs tracking-[4px] text-terra uppercase mb-3 font-semibold">Por que nos escolher</p>
            <h2 className="font-display text-4xl font-bold text-ink">Trabalho com dedicação em cada detalhe.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: <Award className="text-terra" size={28} strokeWidth={1.5} />, title: 'Curadoria pessoal', text: 'Cada imóvel é visitado e avaliado pessoalmente antes de entrar na carteira.' },
              { icon: <Shield className="text-ink" size={28} strokeWidth={1.5} />, title: 'Transparência total', text: 'Contratos claros, documentação revisada e nenhuma surpresa no caminho.' },
              { icon: <Heart className="text-terra" size={28} strokeWidth={1.5} />, title: 'Atendimento próximo', text: 'Do primeiro contato à entrega das chaves, você fala diretamente comigo.' },
            ].map((item, i) => (
              <div key={i} className="bg-white border border-border rounded-2xl p-8 hover:shadow-card transition-all">
                <div className="w-14 h-14 bg-cream rounded-xl flex items-center justify-center mb-5">{item.icon}</div>
                <h3 className="font-display text-xl font-semibold mb-3 text-ink">{item.title}</h3>
                <p className="text-sm text-ink-soft/75 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DESTAQUES */}
      {featured && featured.length > 0 && (
        <section className="py-20 bg-paper">
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
              <div>
                <p className="text-xs tracking-[4px] text-terra uppercase mb-2 font-semibold">Destaques</p>
                <h2 className="font-display text-4xl font-bold text-ink">Imóveis selecionados.</h2>
              </div>
              <Link href="/imoveis" className="text-sm font-medium text-terra hover:underline flex items-center gap-1 group">
                Ver todos <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((p: any) => <PropertyCard key={p.id} property={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 bg-ink text-white">
        <div className="max-w-4xl mx-auto px-6 md:px-8 text-center">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">Tem um imóvel para vender ou alugar?</h2>
          <p className="text-white/70 text-lg mb-10 max-w-2xl mx-auto">Cadastre seu imóvel em poucos minutos. Cuido de tudo: avaliação, divulgação e negociação.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/anuncie" className="btn-primary btn-lg">Cadastrar meu imóvel</Link>
            <a href="https://wa.me/5515996897738" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-7 py-3.5 rounded-lg text-sm font-medium transition">
              <MessageCircle size={16} /> WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

function PropertyCard({ property }: { property: any }) {
  const isRent = property.purpose === 'Locação';
  const price = isRent && property.rent ? `${money(property.rent)}/mês` : money(property.price);
  const photo = property.photos?.[0];
  return (
    <Link href={`/imoveis/${property.id}`} className="group block">
      <div className="relative overflow-hidden rounded-2xl bg-cream aspect-[4/3] mb-4">
        {photo ? (
          <Image src={photo} alt={property.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
        ) : (
          <div className="absolute inset-0 bg-cream flex items-center justify-center">
            <div className="w-16 h-16 bg-terra/20 rounded-xl flex items-center justify-center">
              <svg viewBox="0 0 40 40" className="w-8 h-8 text-terra/60" fill="currentColor"><path d="M4 22 L20 6 L36 22 L36 36 L26 36 L26 26 L14 26 L14 36 L4 36 Z" /></svg>
            </div>
          </div>
        )}
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className="badge bg-white text-ink shadow-soft">{property.purpose}</span>
          {property.is_featured && <span className="badge bg-terra text-white">Destaque</span>}
        </div>
      </div>
      <div className="px-1">
        <div className="flex items-center gap-1 text-xs text-ink-soft/60 mb-1.5"><MapPin size={11} /><span>{property.neighborhood}, {property.city}</span></div>
        <h3 className="font-display text-lg font-semibold text-ink group-hover:text-terra transition-colors line-clamp-2 mb-2">{property.title}</h3>
        <div className="font-display text-xl font-bold text-ink mb-3">{price}</div>
        <div className="flex items-center gap-3 text-xs text-ink-soft/70 pt-3 border-t border-border">
          {property.bedrooms > 0 && <span className="flex items-center gap-1"><Bed size={13} /> {property.bedrooms}</span>}
          <span className="flex items-center gap-1"><Bath size={13} /> {property.bathrooms}</span>
          <span className="flex items-center gap-1"><Car size={13} /> {property.parking}</span>
          <span className="flex items-center gap-1 ml-auto"><Maximize2 size={13} /> {property.area}m²</span>
        </div>
      </div>
    </Link>
  );
}
