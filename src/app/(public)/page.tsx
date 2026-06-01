import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import { money } from '@/lib/utils';
import { ArrowRight, Search, MapPin, Bed, Bath, Car, Maximize2, Award, Shield, Heart, MessageCircle, Mail, Phone } from 'lucide-react';

export const revalidate = 60;

export default async function HomePage() {
  const supabase = createClient();
  const { data: featured } = await supabase.from('properties').select('*').eq('is_published', true).eq('is_featured', true).limit(6);
  const { count: totalProps } = await supabase.from('properties').select('*', { count: 'exact', head: true }).eq('is_published', true);

  return (
    <div className="bg-paper">
      {/* HERO — São Paulo FC inspired with jersey stripes */}
      <section className="relative overflow-hidden bg-paper">
        {/* SPFC diagonal jersey stripes */}
        <div className="spfc-stripes-bg hidden md:block">
          <div className="spfc-stripe spfc-stripe-red" style={{ left: 0, width: 90 }} />
          <div className="spfc-stripe spfc-stripe-black" style={{ left: 130, width: 60 }} />
          <div className="spfc-stripe spfc-stripe-red" style={{ left: 230, width: 90 }} />
        </div>

        {/* Subtle red glow */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-terra/[0.06] blur-[250px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 md:px-8 py-16 md:py-24 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* LEFT — Text content */}
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-terra/10 border border-terra/30 rounded-full px-4 py-2 mb-7">
                <div className="w-2 h-2 rounded-full bg-terra animate-pulse" />
                <span className="text-xs font-semibold text-terra tracking-wide">Capão Bonito · SP</span>
              </div>
              <h1 className="font-display font-bold text-ink leading-[1.05] tracking-tight text-5xl md:text-6xl lg:text-7xl mb-7">
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
            </div>

            {/* RIGHT — Featured property card */}
            <div className="hidden lg:flex items-center justify-center relative z-10">
              <div className="relative w-full max-w-md">
                <div className="bg-white rounded-3xl overflow-hidden shadow-lift border border-border">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src="https://imonuvem.com.br/imovel/95/5004/casa-venda-centro-cm1328930224.jpg"
                      alt="Casa Térrea de Alto Padrão no Centro — Capão Bonito"
                      fill
                      className="object-cover"
                      sizes="500px"
                      unoptimized
                      priority
                    />
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center gap-1.5 bg-terra text-white text-[10px] font-bold tracking-[2px] px-3 py-1.5 rounded-full">
                        <div className="w-1.5 h-1.5 bg-white rounded-full" /> DESTAQUE
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-[11px] font-semibold tracking-[2px] text-terra mb-2">CENTRO · CAPÃO BONITO</p>
                    <h3 className="font-display text-2xl font-bold text-ink mb-3">Casa Térrea de Alto Padrão</h3>
                    <div className="flex items-center gap-4 text-sm text-ink-soft/70 mb-4">
                      <span className="flex items-center gap-1"><Bed size={14} /> 3</span>
                      <span className="flex items-center gap-1"><Bath size={14} /> 2</span>
                      <span className="flex items-center gap-1"><Maximize2 size={14} /> 200m²</span>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <span className="text-sm text-ink-soft/70 font-medium">Venda</span>
                      <span className="font-display text-3xl font-bold text-terra">R$ 990.000</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats bar — solid white card */}
          <div className="mt-16 bg-white rounded-2xl border border-border shadow-soft px-8 md:px-14 py-7 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x md:divide-border relative z-10">
            <div className="md:px-6 flex items-center gap-3">
              <div className="font-display text-3xl font-bold text-ink">{totalProps ?? 0}+</div>
              <div className="text-xs text-ink-soft/60">Imóveis<br />na carteira</div>
            </div>
            <div className="md:px-6 flex items-center gap-3">
              <div className="font-display text-3xl font-bold text-ink">15+</div>
              <div className="text-xs text-ink-soft/60">Anos de<br />experiência</div>
            </div>
            <div className="md:px-6 flex items-center gap-3">
              <div className="font-display text-3xl font-bold text-terra">CRECI</div>
              <div className="text-xs text-ink-soft/60">318284-F</div>
            </div>
            <div className="md:px-6 flex items-center gap-3">
              <div className="font-display text-3xl font-bold text-ink">100%</div>
              <div className="text-xs text-ink-soft/60">Transparência</div>
            </div>
          </div>
        </div>
      </section>

      {/* DESTAQUES */}
      {featured && featured.length > 0 && (
        <section className="py-24 bg-cream/40 border-y border-border">
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
              <div>
                <p className="text-xs tracking-[4px] text-terra uppercase mb-3 font-semibold">Imóveis disponíveis</p>
                <h2 className="font-display text-4xl md:text-5xl font-bold text-ink">Explore nossa seleção.</h2>
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

      {/* SOBRE BETO — Shield crest + text */}
      <section className="py-24 bg-paper">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid md:grid-cols-[300px_1fr] gap-12 lg:gap-20 items-center">
            {/* Shield crest */}
            <div className="mx-auto md:mx-0 relative w-[280px] h-[340px] bg-white border border-border rounded-2xl shadow-card overflow-hidden">
              <div className="absolute inset-x-0 top-[15%] h-[60px] bg-terra" />
              <div className="absolute inset-x-0 bottom-[15%] h-[60px] bg-ink" />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="font-display text-[96px] font-bold text-ink leading-none">BB</div>
              </div>
              <div className="absolute inset-x-0 bottom-[15%] h-[60px] flex items-center justify-center">
                <span className="text-[11px] font-bold tracking-[3px] text-white">CRECI 318284-F</span>
              </div>
            </div>

            {/* About text */}
            <div>
              <p className="text-xs tracking-[3px] text-terra uppercase mb-4 font-semibold">Sobre Beto Baltazar</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-ink leading-tight mb-6">
                15 anos negociando os melhores<br />imóveis de Capão Bonito.
              </h2>
              <p className="text-lg text-ink-soft/75 leading-relaxed mb-8 max-w-2xl">
                Trabalho com compra, venda e locação de imóveis residenciais e comerciais, sempre priorizando a transparência e o melhor negócio para cada cliente.
              </p>
              <a href="https://wa.me/5515996897738" target="_blank" rel="noopener noreferrer" className="btn-primary btn-lg group">
                <MessageCircle size={16} /> Fale comigo pelo WhatsApp
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* VALORES */}
      <section className="py-24 bg-cream/40 border-y border-border">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="text-center mb-14">
            <p className="text-xs tracking-[4px] text-terra uppercase mb-3 font-semibold">Por que nos escolher</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-ink">Trabalho com dedicação em cada detalhe.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: <Award className="text-terra" size={28} strokeWidth={1.5} />, title: 'Curadoria pessoal', text: 'Cada imóvel é visitado e avaliado pessoalmente antes de entrar na carteira.' },
              { icon: <Shield className="text-ink" size={28} strokeWidth={1.5} />, title: 'Transparência total', text: 'Contratos claros, documentação revisada e nenhuma surpresa no caminho.' },
              { icon: <Heart className="text-terra" size={28} strokeWidth={1.5} />, title: 'Atendimento próximo', text: 'Do primeiro contato à entrega das chaves, você fala diretamente comigo.' },
            ].map((item, i) => (
              <div key={i} className="bg-white border border-border rounded-2xl p-8 hover:shadow-card hover:-translate-y-1 transition-all duration-300">
                <div className="w-14 h-14 bg-cream rounded-xl flex items-center justify-center mb-5">{item.icon}</div>
                <h3 className="font-display text-xl font-semibold mb-3 text-ink">{item.title}</h3>
                <p className="text-sm text-ink-soft/75 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTATO — Glass cards */}
      <section className="py-24 bg-paper">
        <div className="max-w-6xl mx-auto px-6 md:px-8 text-center">
          <p className="text-xs tracking-[4px] text-terra uppercase mb-3 font-semibold">Entre em contato</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-ink mb-12">Vamos conversar sobre o seu imóvel?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <a href="https://wa.me/5515996897738" target="_blank" rel="noopener noreferrer" className="glass rounded-2xl p-8 hover:shadow-lift hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-12 h-12 bg-terra/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-terra/20 transition">
                <MessageCircle className="text-terra" size={22} />
              </div>
              <p className="text-[11px] font-bold tracking-[3px] text-terra mb-2">WHATSAPP</p>
              <p className="text-lg font-semibold text-ink">(15) 99689-7738</p>
            </a>
            <a href="mailto:betobaltazar@gmail.com" className="glass rounded-2xl p-8 hover:shadow-lift hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-12 h-12 bg-terra/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-terra/20 transition">
                <Mail className="text-terra" size={22} />
              </div>
              <p className="text-[11px] font-bold tracking-[3px] text-terra mb-2">E-MAIL</p>
              <p className="text-lg font-semibold text-ink break-all">betobaltazar@gmail.com</p>
            </a>
            <div className="glass rounded-2xl p-8 hover:shadow-lift hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 bg-terra/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <MapPin className="text-terra" size={22} />
              </div>
              <p className="text-[11px] font-bold tracking-[3px] text-terra mb-2">LOCALIZAÇÃO</p>
              <p className="text-lg font-semibold text-ink">Capão Bonito / SP</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final — Black bg */}
      <section className="relative py-24 bg-ink text-white overflow-hidden">
        <div className="absolute inset-0 bg-spfc-stripes opacity-[0.04]" />
        <div className="max-w-4xl mx-auto px-6 md:px-8 text-center relative">
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
    <Link href={`/imoveis/${property.id}`} className="group block bg-white rounded-2xl border border-border overflow-hidden hover:shadow-lift hover:-translate-y-1 transition-all duration-300">
      <div className="relative overflow-hidden bg-cream aspect-[4/3]">
        {photo ? (
          <Image src={photo} alt={property.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-cream to-cream-dark flex items-center justify-center">
            <div className="w-16 h-16 bg-terra/20 rounded-xl flex items-center justify-center">
              <svg viewBox="0 0 40 40" className="w-8 h-8 text-terra/60" fill="currentColor"><path d="M4 22 L20 6 L36 22 L36 36 L26 36 L26 26 L14 26 L14 36 L4 36 Z" /></svg>
            </div>
          </div>
        )}
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className="badge bg-terra text-white shadow-soft">{property.purpose}</span>
          {property.is_featured && <span className="badge bg-ink text-white">Destaque</span>}
        </div>
      </div>
      <div className="p-5">
        <p className="text-[11px] font-semibold tracking-[2px] text-terra mb-2">{(property.neighborhood || '').toUpperCase()}</p>
        <h3 className="font-display text-lg font-bold text-ink group-hover:text-terra transition-colors line-clamp-2 mb-3">{property.title}</h3>
        <div className="flex items-center gap-3 text-xs text-ink-soft/70 mb-3 pb-3 border-b border-border">
          {property.bedrooms > 0 && <span className="flex items-center gap-1"><Bed size={13} /> {property.bedrooms}</span>}
          <span className="flex items-center gap-1"><Bath size={13} /> {property.bathrooms}</span>
          <span className="flex items-center gap-1"><Car size={13} /> {property.parking}</span>
          <span className="flex items-center gap-1 ml-auto"><Maximize2 size={13} /> {property.area}m²</span>
        </div>
        <div className="font-display text-2xl font-bold text-terra">{price}</div>
      </div>
    </Link>
  );
}
