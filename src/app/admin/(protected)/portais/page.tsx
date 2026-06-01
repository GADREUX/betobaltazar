import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Globe, ExternalLink, Plus } from 'lucide-react';
import PortaisActions from './portais-actions';
import CopyDescButton from './copy-desc-button';

export const dynamic = 'force-dynamic';

const PORTALS = ['ZAP Imóveis', 'OLX', 'Viva Real', 'Imovelweb', 'Chaves na Mão'];

function money(v: number) {
  return (v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function generateDesc(p: any): string {
  const isRent = p.purpose === 'Locação' || p.purpose === 'Venda e Locação';
  const isSale = p.purpose === 'Venda' || p.purpose === 'Venda e Locação';
  return [
    `${p.type} para ${p.purpose} em ${p.neighborhood}, ${p.city}/${p.state}.`,
    '',
    p.area > 0 ? `📐 ${p.area}m² de área construída${p.lot_area > 0 ? ` em terreno de ${p.lot_area}m²` : ''}.` : '',
    p.bedrooms > 0 ? `🛏 ${p.bedrooms} dormitório(s)${p.suites > 0 ? ` sendo ${p.suites} suíte(s)` : ''}.` : '',
    p.bathrooms > 0 ? `🚿 ${p.bathrooms} banheiro(s).` : '',
    p.parking > 0 ? `🚗 ${p.parking} vaga(s) de garagem.` : '',
    '',
    p.description || '',
    '',
    p.features?.length > 0 ? `✅ ${p.features.join(' · ')}` : '',
    '',
    isSale && p.price > 0 ? `💰 Valor: ${money(p.price)}` : '',
    isRent && p.rent > 0 ? `💰 Aluguel: ${money(p.rent)}/mês` : '',
    p.iptu > 0 ? `📋 IPTU: ${money(p.iptu)}/ano` : '',
    '',
    '📞 Beto Baltazar | CRECI 318284-F',
    '📱 (15) 99689-7738',
  ].filter(Boolean).join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

export default async function PortaisPage() {
  const supabase = createClient();
  const { data: properties } = await supabase
    .from('properties')
    .select('*, portal_listings(*)')
    .eq('is_published', true)
    .order('title');

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs tracking-widest text-terra uppercase font-semibold mb-1">Comercial</p>
        <h2 className="font-display text-2xl font-bold text-ink">Integração com Portais</h2>
        <p className="text-sm text-ink-soft/60 mt-0.5">
          Marque onde cada imóvel está publicado e gere descrições para copiar.
        </p>
      </div>

      {!properties?.length ? (
        <div className="card-base p-16 text-center">
          <Globe size={40} className="text-ink-soft/30 mx-auto mb-3" />
          <h3 className="font-display text-lg font-semibold text-ink mb-1">Nenhum imóvel publicado</h3>
          <p className="text-sm text-ink-soft/60 mb-6">Publique imóveis para gerenciar os portais.</p>
          <Link href="/admin/imoveis" className="btn-primary"><Plus size={16} /> Ir para imóveis</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {properties.map((p: any) => {
            const listings = p.portal_listings || [];
            const activePortals = listings.filter((l: any) => l.status === 'Ativo');
            const desc = generateDesc(p);

            return (
              <div key={p.id} className="card-base p-5">
                <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
                  <div>
                    <div className="font-medium text-ink">{p.title}</div>
                    <div className="text-xs text-ink-soft/60 mt-0.5">
                      {p.neighborhood}, {p.city} · {money(p.price || p.rent)}{p.rent && !p.price ? '/mês' : ''}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-ink-soft/60">{activePortals.length}/{PORTALS.length} portais</span>
                    <Link href={`/imoveis/${p.id}`} target="_blank" className="text-xs text-terra hover:underline flex items-center gap-1">
                      Ver no site <ExternalLink size={11} />
                    </Link>
                  </div>
                </div>

                {/* Portais */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {PORTALS.map(portal => {
                    const listing = listings.find((l: any) => l.portal_name === portal);
                    return (
                      <PortaisActions
                        key={portal}
                        propertyId={p.id}
                        portalName={portal}
                        listing={listing}
                        isActive={listing?.status === 'Ativo'}
                        externalUrl={listing?.external_url}
                      />
                    );
                  })}
                </div>

                {/* Descrição */}
                <details className="mt-1">
                  <summary className="text-xs text-terra cursor-pointer hover:underline select-none w-fit">
                    Gerar descrição para portais ▸
                  </summary>
                  <div className="mt-3 bg-cream/50 border border-border rounded-xl p-4">
                    <pre className="text-xs text-ink whitespace-pre-wrap font-sans leading-relaxed">{desc}</pre>
                    <CopyDescButton text={desc} />
                  </div>
                </details>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
