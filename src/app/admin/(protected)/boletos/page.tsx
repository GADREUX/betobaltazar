import { createClient } from '@/lib/supabase/server';
import { money, fmtDate, daysUntil } from '@/lib/utils';
import Link from 'next/link';
import { Plus, Receipt, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import BoletoActions from './boleto-actions';

export const dynamic = 'force-dynamic';

export default async function BoletosPage() {
  const supabase = createClient();
  const { data: boletos } = await supabase
    .from('boletos')
    .select('*, contracts(rent_value), tenants(name, phone), properties(title)')
    .order('due_date', { ascending: true });

  const pendentes = boletos?.filter(b => b.status === 'Pendente') || [];
  const vencidos = pendentes.filter(b => (daysUntil(b.due_date) ?? 0) < 0);
  const totalPendente = pendentes.reduce((s, b) => s + (b.value || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs tracking-widest text-terra uppercase font-semibold mb-1">Operação</p>
          <h2 className="font-display text-2xl font-bold text-ink">Boletos PIX</h2>
          <p className="text-sm text-ink-soft/60 mt-0.5">
            {pendentes.length} pendente(s) · {money(totalPendente)} a receber
          </p>
        </div>
        <Link href="/admin/boletos/novo" className="btn-primary">
          <Plus size={16} /> Novo Boleto
        </Link>
      </div>

      {/* Alerta de vencidos */}
      {vencidos.length > 0 && (
        <div className="flex items-center gap-3 bg-red/10 border border-red/20 rounded-xl p-4">
          <AlertCircle size={18} className="text-red shrink-0" />
          <p className="text-sm text-ink">
            <strong>{vencidos.length} boleto(s) vencido(s)</strong> · {money(vencidos.reduce((s, b) => s + b.value, 0))} em atraso. Envie lembrete via WhatsApp.
          </p>
        </div>
      )}

      {/* Filtros rápidos */}
      <div className="flex gap-2 flex-wrap">
        {['Todos', 'Pendente', 'Pago', 'Vencido', 'Cancelado'].map(f => (
          <Link key={f} href={f === 'Todos' ? '/admin/boletos' : `/admin/boletos?status=${f}`}
            className="px-4 py-2 rounded-lg text-sm font-medium border bg-white border-border text-ink hover:border-terra transition">
            {f}
          </Link>
        ))}
      </div>

      {!boletos?.length ? (
        <div className="card-base p-16 text-center">
          <Receipt size={40} className="text-ink-soft/30 mx-auto mb-3" />
          <h3 className="font-display text-lg font-semibold text-ink mb-1">Nenhum boleto</h3>
          <p className="text-sm text-ink-soft/60 mb-6">Gere boletos PIX para os contratos ativos.</p>
          <Link href="/admin/boletos/novo" className="btn-primary"><Plus size={16} /> Gerar primeiro boleto</Link>
        </div>
      ) : (
        <div className="card-base overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-cream border-b border-border">
                  {['Inquilino','Imóvel','Valor','Vencimento','Status','Ações'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-[10px] tracking-widest text-ink-soft/60 uppercase font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {boletos.map((b: any) => {
                  const days = daysUntil(b.due_date);
                  const overdue = (days ?? 0) < 0 && b.status === 'Pendente';
                  const soonDue = !overdue && (days ?? 99) <= 3 && b.status === 'Pendente';
                  return (
                    <tr key={b.id} className={`hover:bg-cream/30 transition ${overdue ? 'bg-red/5' : ''}`}>
                      <td className="px-5 py-4">
                        <div className="font-medium text-ink">{b.tenants?.name}</div>
                        {b.tenants?.phone && <div className="text-xs text-ink-soft/60">{b.tenants.phone}</div>}
                      </td>
                      <td className="px-5 py-4 text-sm text-ink-soft truncate max-w-[180px]">{b.properties?.title}</td>
                      <td className="px-5 py-4 font-semibold text-ink">{money(b.value)}</td>
                      <td className="px-5 py-4">
                        <div className="text-sm text-ink">{fmtDate(b.due_date)}</div>
                        {overdue && <div className="flex items-center gap-1 text-xs text-red mt-0.5"><AlertCircle size={11} /> {Math.abs(days!)}d atraso</div>}
                        {soonDue && <div className="flex items-center gap-1 text-xs text-yellow mt-0.5"><Clock size={11} /> Vence em {days}d</div>}
                        {b.paid_date && <div className="text-xs text-green mt-0.5">Pago em {fmtDate(b.paid_date)}</div>}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`badge ${
                          b.status === 'Pago' ? 'bg-green/10 text-green' :
                          b.status === 'Pendente' ? (overdue ? 'bg-red/10 text-red' : 'bg-yellow/10 text-yellow') :
                          'bg-ink/10 text-ink-soft'
                        }`}>{overdue && b.status === 'Pendente' ? 'Vencido' : b.status}</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1">
                          <Link href={`/admin/boletos/${b.id}`} className="p-2 hover:bg-cream rounded-md text-ink-soft hover:text-terra transition text-xs font-medium" title="Ver PIX">
                            PIX
                          </Link>
                          <BoletoActions
                            id={b.id}
                            status={b.status}
                            tenantName={b.tenants?.name}
                            tenantPhone={b.tenants?.phone}
                            value={b.value}
                            dueDate={b.due_date}
                          />
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
