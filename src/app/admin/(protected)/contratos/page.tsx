import { createClient } from '@/lib/supabase/server';
import { money, fmtDate, daysUntil } from '@/lib/utils';
import Link from 'next/link';
import { Plus, FileSignature, AlertCircle, CheckCircle2, Clock, Edit2 } from 'lucide-react';
import ContractActions from './contract-actions';

export const dynamic = 'force-dynamic';

export default async function ContratosPage() {
  const supabase = createClient();
  const { data: contracts } = await supabase
    .from('contracts')
    .select('*, properties(title, neighborhood, city), owners(name), tenants(name, phone)')
    .order('created_at', { ascending: false });

  const ativos = contracts?.filter(c => c.status === 'Ativo').length || 0;
  const vencendo = contracts?.filter(c => {
    const days = daysUntil(c.end_date);
    return c.status === 'Ativo' && days !== null && days <= 30 && days >= 0;
  }).length || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs tracking-widest text-terra uppercase font-semibold mb-1">Operação</p>
          <h2 className="font-display text-2xl font-bold text-ink">Contratos de Locação</h2>
          <p className="text-sm text-ink-soft/60 mt-0.5">{ativos} ativo(s) · {contracts?.length || 0} total</p>
        </div>
        <Link href="/admin/contratos/novo" className="btn-primary">
          <Plus size={16} /> Novo Contrato
        </Link>
      </div>

      {/* Alertas */}
      {vencendo > 0 && (
        <div className="flex items-center gap-3 bg-yellow/10 border border-yellow/30 rounded-xl p-4">
          <AlertCircle size={18} className="text-yellow shrink-0" />
          <p className="text-sm text-ink">
            <strong>{vencendo} contrato(s)</strong> vence(m) nos próximos 30 dias. Considere entrar em contato com os inquilinos.
          </p>
        </div>
      )}

      {!contracts?.length ? (
        <div className="card-base p-16 text-center">
          <FileSignature size={40} className="text-ink-soft/30 mx-auto mb-3" />
          <h3 className="font-display text-lg font-semibold text-ink mb-1">Nenhum contrato</h3>
          <p className="text-sm text-ink-soft/60 mb-6">Cadastre os contratos de locação dos imóveis.</p>
          <Link href="/admin/contratos/novo" className="btn-primary"><Plus size={16} /> Cadastrar primeiro</Link>
        </div>
      ) : (
        <div className="card-base overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-cream border-b border-border">
                  {['Imóvel','Inquilino','Valor','Período','Status','Ações'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-[10px] tracking-widest text-ink-soft/60 uppercase font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {contracts.map((c: any) => {
                  const days = daysUntil(c.end_date);
                  const isExpiringSoon = c.status === 'Ativo' && days !== null && days <= 30 && days >= 0;
                  const isOverdue = days !== null && days < 0 && c.status === 'Ativo';
                  return (
                    <tr key={c.id} className="hover:bg-cream/30 transition">
                      <td className="px-5 py-4">
                        <div className="font-medium text-ink truncate max-w-[200px]">{c.properties?.title}</div>
                        <div className="text-xs text-ink-soft/60">{c.properties?.neighborhood}, {c.properties?.city}</div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="text-sm text-ink">{c.tenants?.name}</div>
                        {c.tenants?.phone && <div className="text-xs text-ink-soft/60">{c.tenants.phone}</div>}
                      </td>
                      <td className="px-5 py-4 font-semibold text-ink">{money(c.rent_value)}/mês</td>
                      <td className="px-5 py-4">
                        <div className="text-xs text-ink-soft">{fmtDate(c.start_date)} →</div>
                        <div className="text-xs text-ink-soft">{fmtDate(c.end_date)}</div>
                        {isExpiringSoon && (
                          <div className="flex items-center gap-1 text-xs text-yellow mt-1">
                            <Clock size={11} /> Vence em {days}d
                          </div>
                        )}
                        {isOverdue && (
                          <div className="flex items-center gap-1 text-xs text-red mt-1">
                            <AlertCircle size={11} /> Vencido há {Math.abs(days!)}d
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`badge ${
                          c.status === 'Ativo' ? 'bg-green/10 text-green' :
                          c.status === 'Pendente' ? 'bg-yellow/10 text-yellow' :
                          'bg-ink/10 text-ink-soft'
                        }`}>{c.status}</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1">
                          <Link href={`/admin/contratos/${c.id}`} className="p-2 hover:bg-cream rounded-md text-ink-soft hover:text-terra transition" title="Ver / Imprimir">
                            <FileSignature size={15} />
                          </Link>
                          <Link href={`/admin/contratos/${c.id}/editar`} className="p-2 hover:bg-cream rounded-md text-ink-soft hover:text-terra transition" title="Editar">
                            <Edit2 size={15} />
                          </Link>
                          <ContractActions id={c.id} tenantName={c.tenants?.name} tenantPhone={c.tenants?.phone} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
