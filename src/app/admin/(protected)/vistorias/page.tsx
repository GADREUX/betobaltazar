import { createClient } from '@/lib/supabase/server';
import { fmtDate } from '@/lib/utils';
import Link from 'next/link';
import { Plus, ClipboardCheck, Edit2, Eye } from 'lucide-react';
import VistoriaActions from './vistoria-actions';

export const dynamic = 'force-dynamic';

export default async function VistoriasPage() {
  const supabase = createClient();
  const { data: inspections } = await supabase
    .from('inspections')
    .select('*, properties(title, neighborhood, city), tenants(name)')
    .order('inspection_date', { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs tracking-widest text-terra uppercase font-semibold mb-1">Operação</p>
          <h2 className="font-display text-2xl font-bold text-ink">Vistorias</h2>
          <p className="text-sm text-ink-soft/60 mt-0.5">{inspections?.length || 0} laudo(s) registrado(s)</p>
        </div>
        <Link href="/admin/vistorias/nova" className="btn-primary">
          <Plus size={16} /> Nova Vistoria
        </Link>
      </div>

      {!inspections?.length ? (
        <div className="card-base p-16 text-center">
          <ClipboardCheck size={40} className="text-ink-soft/30 mx-auto mb-3" />
          <h3 className="font-display text-lg font-semibold text-ink mb-1">Nenhuma vistoria</h3>
          <p className="text-sm text-ink-soft/60 mb-6">Registre laudos de entrada e saída dos imóveis.</p>
          <Link href="/admin/vistorias/nova" className="btn-primary"><Plus size={16} /> Criar primeira vistoria</Link>
        </div>
      ) : (
        <div className="card-base overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-cream border-b border-border">
                  {['Imóvel','Inquilino','Tipo','Data','Status','Ações'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-[10px] tracking-widest text-ink-soft/60 uppercase font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {inspections.map((v: any) => (
                  <tr key={v.id} className="hover:bg-cream/30 transition">
                    <td className="px-5 py-4">
                      <div className="font-medium text-ink truncate max-w-[200px]">{v.properties?.title}</div>
                      <div className="text-xs text-ink-soft/60">{v.properties?.neighborhood}, {v.properties?.city}</div>
                    </td>
                    <td className="px-5 py-4 text-sm text-ink">{v.tenants?.name || '—'}</td>
                    <td className="px-5 py-4">
                      <span className={`badge ${v.inspection_type === 'Entrada' ? 'bg-green/10 text-green' : 'bg-terra/10 text-terra'}`}>
                        {v.inspection_type}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-ink">{fmtDate(v.inspection_date)}</td>
                    <td className="px-5 py-4">
                      <span className={`badge ${v.status === 'Concluído' ? 'bg-green/10 text-green' : 'bg-yellow/10 text-yellow'}`}>
                        {v.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-1">
                        <Link href={`/admin/vistorias/${v.id}`} className="p-2 hover:bg-cream rounded-md text-ink-soft hover:text-terra transition" title="Ver laudo"><Eye size={15} /></Link>
                        <Link href={`/admin/vistorias/${v.id}/editar`} className="p-2 hover:bg-cream rounded-md text-ink-soft hover:text-terra transition" title="Editar"><Edit2 size={15} /></Link>
                        <VistoriaActions id={v.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
