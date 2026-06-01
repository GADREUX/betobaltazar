import { createClient } from '@/lib/supabase/server';
import { money } from '@/lib/utils';
import { BarChart3, TrendingUp, Building2, Target, Receipt, FileSignature } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function RelatoriosPage() {
  const supabase = createClient();
  const [
    { data: properties },
    { data: contracts },
    { data: boletos },
    { data: leads },
    { data: inspections },
  ] = await Promise.all([
    supabase.from('properties').select('*'),
    supabase.from('contracts').select('*, tenants(name)'),
    supabase.from('boletos').select('*'),
    supabase.from('leads').select('*'),
    supabase.from('inspections').select('*'),
  ]);

  const P = properties || [];
  const C = contracts || [];
  const B = boletos || [];
  const L = leads || [];

  // KPIs
  const totalCarteira = P.reduce((s, p) => s + (p.price || 0), 0);
  const receitaMensal = C.filter(c => c.status === 'Ativo').reduce((s, c) => s + (c.rent_value || 0), 0);
  const boletosRecebidos = B.filter(b => b.status === 'Pago').reduce((s, b) => s + (b.value || 0), 0);
  const boletosEmAberto = B.filter(b => b.status === 'Pendente').reduce((s, b) => s + (b.value || 0), 0);
  const conversion = L.length ? Math.round((L.filter(l => l.stage === 'Fechado').length / L.length) * 100) : 0;

  // Imóveis por tipo
  const byType = P.reduce((acc: Record<string, number>, p) => {
    acc[p.type] = (acc[p.type] || 0) + 1;
    return acc;
  }, {});

  // Imóveis por status
  const byStatus = P.reduce((acc: Record<string, number>, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1;
    return acc;
  }, {});

  // Leads por fonte
  const bySource = L.reduce((acc: Record<string, number>, l) => {
    acc[l.source] = (acc[l.source] || 0) + 1;
    return acc;
  }, {});

  // Leads por estágio
  const STAGES = ['Novo Lead', 'Contato Feito', 'Visita Agendada', 'Proposta', 'Negociação', 'Fechado', 'Perdido'];
  const byStage = STAGES.map(s => ({ stage: s, count: L.filter(l => l.stage === s).length }));
  const maxStage = Math.max(...byStage.map(s => s.count), 1);

  // Boletos por mês (últimos 6 meses)
  const boletosByMonth = B.filter(b => b.status === 'Pago').reduce((acc: Record<string, number>, b) => {
    const month = (b.paid_date || b.due_date)?.slice(0, 7);
    if (month) acc[month] = (acc[month] || 0) + b.value;
    return acc;
  }, {});
  const recentMonths = Object.entries(boletosByMonth).sort().slice(-6);
  const maxMonth = Math.max(...recentMonths.map(([, v]) => v), 1);

  const STATUS_COLORS: Record<string, string> = {
    'Disponível': 'bg-green',
    'Reservado': 'bg-yellow',
    'Alugado': 'bg-moss',
    'Vendido': 'bg-blue',
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs tracking-widest text-terra uppercase font-semibold mb-1">Análise</p>
        <h2 className="font-display text-2xl font-bold text-ink">Relatórios</h2>
      </div>

      {/* KPIs principais */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { icon: Building2, label: 'Carteira total (venda)', value: money(totalCarteira), sub: `${P.length} imóveis` },
          { icon: FileSignature, label: 'Receita mensal', value: money(receitaMensal), sub: `${C.filter(c=>c.status==='Ativo').length} contratos ativos` },
          { icon: Receipt, label: 'Recebido (boletos pagos)', value: money(boletosRecebidos), sub: `${B.filter(b=>b.status==='Pago').length} boletos` },
          { icon: Receipt, label: 'A receber (pendentes)', value: money(boletosEmAberto), sub: `${B.filter(b=>b.status==='Pendente').length} boletos` },
          { icon: Target, label: 'Taxa de conversão', value: `${conversion}%`, sub: `${L.filter(l=>l.stage==='Fechado').length} de ${L.length} leads` },
          { icon: BarChart3, label: 'Vistorias realizadas', value: inspections?.length || 0, sub: `${inspections?.filter(i=>i.status==='Concluído').length || 0} concluídas` },
        ].map((kpi, i) => (
          <div key={i} className="card-base p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-terra/10 flex items-center justify-center text-terra">
                <kpi.icon size={18} strokeWidth={1.7} />
              </div>
            </div>
            <div className="font-display text-2xl font-bold text-ink">{kpi.value}</div>
            <div className="text-sm text-ink-soft mt-0.5">{kpi.label}</div>
            <div className="text-xs text-ink-soft/50 mt-0.5">{kpi.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Funil de leads */}
        <div className="card-base p-6">
          <h3 className="font-display text-lg font-semibold text-ink mb-5">Funil de leads</h3>
          <div className="space-y-3">
            {byStage.map(({ stage, count }) => (
              <div key={stage} className="flex items-center gap-3">
                <div className="w-32 text-xs text-ink-soft/70 text-right shrink-0">{stage}</div>
                <div className="flex-1 h-7 bg-cream rounded-lg overflow-hidden">
                  <div
                    className="h-full bg-terra flex items-center pl-3 text-xs font-semibold text-white transition-all"
                    style={{ width: `${Math.max((count / maxStage) * 100, count > 0 ? 8 : 0)}%` }}
                  >
                    {count > 0 ? count : ''}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Receita por mês */}
        <div className="card-base p-6">
          <h3 className="font-display text-lg font-semibold text-ink mb-5">Receita recebida (últimos 6 meses)</h3>
          {recentMonths.length === 0 ? (
            <div className="text-center py-8 text-ink-soft/50 text-sm">Nenhum boleto pago registrado</div>
          ) : (
            <div className="space-y-3">
              {recentMonths.map(([month, value]) => (
                <div key={month} className="flex items-center gap-3">
                  <div className="w-16 text-xs text-ink-soft/70 text-right shrink-0">{month.slice(5)}/{month.slice(2,4)}</div>
                  <div className="flex-1 h-7 bg-cream rounded-lg overflow-hidden">
                    <div
                      className="h-full bg-moss flex items-center pl-3 text-xs font-semibold text-white transition-all"
                      style={{ width: `${Math.max((value / maxMonth) * 100, 8)}%` }}
                    >
                      {money(value)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Imóveis por tipo */}
        <div className="card-base p-6">
          <h3 className="font-display text-lg font-semibold text-ink mb-5">Carteira por tipo</h3>
          <div className="space-y-3">
            {Object.entries(byType).sort(([,a],[,b]) => b-a).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                <span className="text-sm text-ink">{type}</span>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-2 bg-cream rounded-full overflow-hidden">
                    <div className="h-full bg-terra rounded-full" style={{ width: `${(count / P.length) * 100}%` }} />
                  </div>
                  <span className="text-sm font-semibold text-ink w-4 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Imóveis por status */}
        <div className="card-base p-6">
          <h3 className="font-display text-lg font-semibold text-ink mb-5">Status da carteira</h3>
          <div className="space-y-3">
            {Object.entries(byStatus).sort(([,a],[,b]) => b-a).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${STATUS_COLORS[status] || 'bg-ink/30'}`} />
                  <span className="text-sm text-ink">{status}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-2 bg-cream rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${STATUS_COLORS[status] || 'bg-ink/30'}`} style={{ width: `${(count / P.length) * 100}%` }} />
                  </div>
                  <span className="text-sm font-semibold text-ink w-4 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leads por fonte */}
        <div className="card-base p-6">
          <h3 className="font-display text-lg font-semibold text-ink mb-5">Origem dos leads</h3>
          {!L.length ? (
            <div className="text-center py-8 text-ink-soft/50 text-sm">Nenhum lead cadastrado</div>
          ) : (
            <div className="space-y-3">
              {Object.entries(bySource).sort(([,a],[,b]) => b-a).map(([source, count]) => (
                <div key={source} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <span className="text-sm text-ink">{source}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-2 bg-cream rounded-full overflow-hidden">
                      <div className="h-full bg-blue rounded-full" style={{ width: `${(count / L.length) * 100}%` }} />
                    </div>
                    <span className="text-sm font-semibold text-ink w-4 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
