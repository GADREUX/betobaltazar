import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { money, timeAgo, fmtDate, daysUntil } from '@/lib/utils';
import { Building2, FileSignature, DollarSign, Bell, Target, Tag, Inbox, ArrowRight } from 'lucide-react';
export const dynamic = 'force-dynamic';
export default async function AdminDashboard() {
  const supabase = createClient();
  const [{ data: P }, { data: C }, { data: B }, { data: L }, { data: S }] = await Promise.all([
    supabase.from('properties').select('*'),
    supabase.from('contracts').select('*'),
    supabase.from('boletos').select('*'),
    supabase.from('leads').select('*'),
    supabase.from('submissions').select('*').eq('status', 'Novo').order('created_at', { ascending: false }),
  ]);
  const props = P || []; const contracts = C || []; const boletos = B || []; const leads = L || []; const subs = S || [];
  const activeContracts = contracts.filter(c => c.status === 'Ativo').length;
  const monthlyRent = contracts.filter(c => c.status === 'Ativo').reduce((s, c) => s + (c.rent_value || 0), 0);
  const pendingBoletos = boletos.filter(b => b.status === 'Pendente');
  const overdue = pendingBoletos.filter(b => (daysUntil(b.due_date) ?? 0) < 0);
  const openLeads = leads.filter(l => !['Fechado','Perdido'].includes(l.stage)).length;
  const totalValue = props.reduce((s, p) => s + (p.price || 0), 0);
  const stats = [
    { v: props.length, l: 'Imóveis', sub: `${props.filter(p=>p.status==='Disponível').length} disponíveis`, icon: Building2, href: '/admin/imoveis' },
    { v: activeContracts, l: 'Contratos ativos', sub: `${contracts.length} total`, icon: FileSignature, href: '/admin/contratos' },
    { v: money(monthlyRent), l: 'Receita mensal', sub: 'aluguéis ativos', icon: DollarSign, href: '/admin/boletos' },
    { v: pendingBoletos.length, l: 'Boletos pendentes', sub: overdue.length > 0 ? `${overdue.length} vencido(s)` : 'em dia', icon: Bell, href: '/admin/boletos' },
    { v: openLeads, l: 'Leads em aberto', sub: `${leads.length} total`, icon: Target, href: '/admin/crm' },
    { v: money(totalValue), l: 'Carteira total', sub: 'valor em venda', icon: Tag, href: '/admin/relatorios' },
  ];
  return (
    <div className="space-y-6">
      {subs.length > 0 && (
        <Link href="/admin/submissoes" className="flex items-center gap-4 bg-terra text-white rounded-2xl p-5 hover:bg-terra-dark transition shadow-card">
          <Inbox size={24} /><div className="flex-1"><div className="font-display text-lg font-bold">{subs.length} {subs.length === 1 ? 'nova solicitação' : 'novas solicitações'} no site</div><div className="text-sm text-white/80">{subs[0].name} · {timeAgo(subs[0].created_at)}</div></div><ArrowRight size={18} />
        </Link>
      )}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((s, i) => (
          <Link key={i} href={s.href} className="group bg-white border border-border rounded-2xl p-6 hover:shadow-card transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-terra/10 flex items-center justify-center text-terra"><s.icon size={18} strokeWidth={1.7} /></div>
              <ArrowRight size={14} className="text-border group-hover:text-terra transition" />
            </div>
            <div className="font-display text-2xl font-bold text-ink">{s.v}</div>
            <div className="text-sm text-ink-soft mt-1">{s.l}</div>
            <div className="text-xs text-ink-soft/50 mt-0.5">{s.sub}</div>
          </Link>
        ))}
      </div>
      {subs.length > 0 && (
        <div className="card-base p-6">
          <div className="flex items-center justify-between mb-4"><h3 className="font-display text-lg font-semibold">Últimas solicitações</h3><Link href="/admin/submissoes" className="text-xs text-terra hover:underline">Ver todas →</Link></div>
          <div className="divide-y divide-border">
            {subs.slice(0,4).map(s => (
              <Link key={s.id} href="/admin/submissoes" className="flex items-center justify-between py-3 hover:bg-cream/40 px-2 -mx-2 rounded transition">
                <div><div className="text-sm font-medium text-ink">{s.name}</div><div className="text-xs text-ink-soft/60">{s.property_type} · {s.phone}</div></div>
                <div className="text-xs text-ink-soft/50">{timeAgo(s.created_at)}</div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
