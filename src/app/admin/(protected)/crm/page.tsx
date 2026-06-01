import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Plus, Target } from 'lucide-react';
import KanbanBoard from './kanban-board';

export const dynamic = 'force-dynamic';

const STAGES = ['Novo Lead', 'Contato Feito', 'Visita Agendada', 'Proposta', 'Negociação', 'Fechado', 'Perdido'];

export default async function CrmPage() {
  const supabase = createClient();
  const { data: leads } = await supabase
    .from('leads')
    .select('*, properties(title)')
    .order('last_contact_at', { ascending: false });

  const total = leads?.length || 0;
  const open = leads?.filter(l => !['Fechado', 'Perdido'].includes(l.stage)).length || 0;
  const closed = leads?.filter(l => l.stage === 'Fechado').length || 0;
  const conversion = total ? Math.round((closed / total) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs tracking-widest text-terra uppercase font-semibold mb-1">Comercial</p>
          <h2 className="font-display text-2xl font-bold text-ink">CRM — Funil de Vendas</h2>
          <p className="text-sm text-ink-soft/60 mt-0.5">
            {open} em aberto · {closed} fechados · {conversion}% conversão
          </p>
        </div>
        <Link href="/admin/crm/novo" className="btn-primary">
          <Plus size={16} /> Novo Lead
        </Link>
      </div>

      {!leads?.length ? (
        <div className="card-base p-16 text-center">
          <Target size={40} className="text-ink-soft/30 mx-auto mb-3" />
          <h3 className="font-display text-lg font-semibold text-ink mb-1">Nenhum lead</h3>
          <p className="text-sm text-ink-soft/60 mb-6">Cadastre leads para acompanhar o funil de vendas.</p>
          <Link href="/admin/crm/novo" className="btn-primary"><Plus size={16} /> Cadastrar primeiro lead</Link>
        </div>
      ) : (
        <KanbanBoard initialLeads={leads} stages={STAGES} />
      )}
    </div>
  );
}
