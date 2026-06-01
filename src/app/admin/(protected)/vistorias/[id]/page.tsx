import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { fmtDate } from '@/lib/utils';
import Link from 'next/link';
import { ArrowLeft, Edit2 } from 'lucide-react';
import PrintButton from '../../contratos/[id]/print-button';

export const dynamic = 'force-dynamic';

const CONDITION_COLORS: Record<string, string> = {
  'Ótimo': 'bg-green/10 text-green',
  'Bom': 'bg-moss/10 text-moss',
  'Regular': 'bg-yellow/10 text-yellow',
  'Ruim': 'bg-terra/10 text-terra',
  'Péssimo': 'bg-red/10 text-red',
};

export default async function VistoriaDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const [{ data: v }, { data: items }] = await Promise.all([
    supabase.from('inspections').select('*, properties(title, address, neighborhood, city, state), tenants(name, cpf)').eq('id', params.id).single(),
    supabase.from('inspection_items').select('*').eq('inspection_id', params.id).order('display_order'),
  ]);

  if (!v) notFound();

  const rooms = [...new Set((items || []).map(i => i.room))];

  return (
    <div className="max-w-4xl space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <Link href="/admin/vistorias" className="text-sm text-ink-soft hover:text-terra flex items-center gap-1.5"><ArrowLeft size={14} /> Voltar</Link>
        <div className="flex gap-2">
          <PrintButton />
          <Link href={`/admin/vistorias/${v.id}/editar`} className="btn-outline"><Edit2 size={14} /> Editar</Link>
        </div>
      </div>

      <div id="contrato-pdf" className="card-base p-10 space-y-8 print:shadow-none print:border-none">
        {/* Cabeçalho */}
        <div className="text-center border-b border-border pb-8">
          <h1 className="font-display text-3xl font-bold text-ink mb-1">LAUDO DE VISTORIA DE {v.inspection_type?.toUpperCase()}</h1>
          <p className="text-sm text-ink-soft/70">{v.properties?.title}</p>
          <p className="text-sm text-ink-soft/70">{v.properties?.address}, {v.properties?.neighborhood} — {v.properties?.city}/{v.properties?.state}</p>
        </div>

        {/* Dados gerais */}
        <div className="grid sm:grid-cols-3 gap-5">
          {[
            { l: 'Data da vistoria', v: fmtDate(v.inspection_date) },
            { l: 'Tipo', v: v.inspection_type },
            { l: 'Status', v: v.status },
            { l: 'Inquilino', v: v.tenants?.name || '—' },
            { l: 'CPF', v: v.tenants?.cpf || '—' },
            { l: 'Vistoriador', v: v.inspector_name },
          ].map(item => (
            <div key={item.l} className="bg-cream/40 rounded-xl p-4">
              <p className="text-xs text-ink-soft/60 mb-1">{item.l}</p>
              <p className="text-sm font-medium text-ink">{item.v}</p>
            </div>
          ))}
        </div>

        {/* Observações gerais */}
        {v.general_notes && (
          <div>
            <h2 className="font-display text-lg font-semibold text-ink border-b border-border pb-2 mb-3">Observações gerais</h2>
            <p className="text-sm text-ink-soft leading-relaxed">{v.general_notes}</p>
          </div>
        )}

        {/* Itens por cômodo */}
        {rooms.map(room => (
          <div key={room}>
            <h2 className="font-display text-lg font-semibold text-ink border-b border-border pb-2 mb-3">{room}</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-cream/50">
                  <th className="text-left px-3 py-2 text-xs text-ink-soft/60 font-semibold w-1/3">Item</th>
                  <th className="text-left px-3 py-2 text-xs text-ink-soft/60 font-semibold w-1/4">Condição</th>
                  <th className="text-left px-3 py-2 text-xs text-ink-soft/60 font-semibold">Observações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {(items || []).filter(i => i.room === room).map(item => (
                  <tr key={item.id}>
                    <td className="px-3 py-2.5 font-medium text-ink">{item.item}</td>
                    <td className="px-3 py-2.5">
                      <span className={`badge ${CONDITION_COLORS[item.condition] || 'bg-cream text-ink'}`}>{item.condition}</span>
                    </td>
                    <td className="px-3 py-2.5 text-ink-soft/75">{item.notes || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

        {/* Assinaturas */}
        <div className="pt-8 border-t border-border">
          <p className="text-sm text-ink-soft text-center mb-10">{v.properties?.city}/{v.properties?.state}, {fmtDate(v.inspection_date)}</p>
          <div className="grid sm:grid-cols-2 gap-12">
            <div className="text-center">
              <div className="border-t border-ink mt-12 pt-2">
                <p className="text-sm font-medium text-ink">{v.tenants?.name || 'Inquilino'}</p>
                <p className="text-xs text-ink-soft">Locatário</p>
              </div>
            </div>
            <div className="text-center">
              <div className="border-t border-ink mt-12 pt-2">
                <p className="text-sm font-medium text-ink">{v.inspector_name}</p>
                <p className="text-xs text-ink-soft">Corretor Vistoriador · CRECI 318284-F</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
