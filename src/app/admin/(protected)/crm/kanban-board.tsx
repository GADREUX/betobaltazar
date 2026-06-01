'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { money, timeAgo } from '@/lib/utils';
import { Phone, MessageCircle, Edit2, Trash2, GripVertical, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

const STAGE_COLORS: Record<string, string> = {
  'Novo Lead': 'bg-blue/10 text-blue border-blue/20',
  'Contato Feito': 'bg-moss/10 text-moss border-moss/20',
  'Visita Agendada': 'bg-yellow/10 text-yellow border-yellow/20',
  'Proposta': 'bg-terra/10 text-terra border-terra/20',
  'Negociação': 'bg-gold/10 text-gold border-gold/20',
  'Fechado': 'bg-green/10 text-green border-green/20',
  'Perdido': 'bg-ink/10 text-ink-soft border-ink/10',
};

const SOURCE_LABELS: Record<string, string> = {
  'Site': '🌐',
  'WhatsApp': '💬',
  'Indicação': '👥',
  'Portal': '🏢',
  'Instagram': '📸',
  'Facebook': '📘',
  'Telefone': '📞',
  'Outro': '•',
};

export default function KanbanBoard({ initialLeads, stages }: { initialLeads: any[]; stages: string[] }) {
  const router = useRouter();
  const [leads, setLeads] = useState(initialLeads);
  const [dragging, setDragging] = useState<string | null>(null);
  const [view, setView] = useState<'kanban' | 'list'>('kanban');

  async function moveToStage(leadId: string, newStage: string) {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, stage: newStage } : l));
    const supabase = createClient();
    const { error } = await supabase.from('leads').update({ stage: newStage, last_contact_at: new Date().toISOString() }).eq('id', leadId);
    if (error) { toast.error('Erro ao mover lead'); router.refresh(); }
  }

  async function deleteLead(id: string, name: string) {
    if (!confirm(`Excluir lead "${name}"?`)) return;
    const supabase = createClient();
    const { error } = await supabase.from('leads').delete().eq('id', id);
    if (error) { toast.error('Erro ao excluir'); return; }
    setLeads(prev => prev.filter(l => l.id !== id));
    toast.success('Lead excluído');
  }

  function onDragStart(e: React.DragEvent, leadId: string) {
    setDragging(leadId);
    e.dataTransfer.effectAllowed = 'move';
  }

  function onDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }

  function onDrop(e: React.DragEvent, stage: string) {
    e.preventDefault();
    if (dragging) { moveToStage(dragging, stage); setDragging(null); }
  }

  // Kanban view
  if (view === 'kanban') {
    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          <button onClick={() => setView('kanban')} className="btn-secondary btn-sm">Kanban</button>
          <button onClick={() => setView('list')} className="btn-outline btn-sm">Lista</button>
        </div>
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4" style={{ minWidth: `${stages.length * 280}px` }}>
            {stages.map(stage => {
              const stageLeads = leads.filter(l => l.stage === stage);
              const total = stageLeads.reduce((s, l) => s + (l.deal_value || 0), 0);
              return (
                <div
                  key={stage}
                  className="w-[272px] shrink-0"
                  onDragOver={onDragOver}
                  onDrop={e => onDrop(e, stage)}
                >
                  <div className="flex items-center justify-between mb-3 px-1">
                    <div>
                      <span className={`badge border ${STAGE_COLORS[stage]} text-xs`}>{stage}</span>
                      <span className="text-xs text-ink-soft/50 ml-2">{stageLeads.length}</span>
                    </div>
                    {total > 0 && <span className="text-xs text-ink-soft/60">{money(total)}</span>}
                  </div>

                  <div className="space-y-2 min-h-[100px] rounded-xl p-2 bg-cream/40 border border-border border-dashed transition-colors">
                    {stageLeads.map(lead => (
                      <div
                        key={lead.id}
                        draggable
                        onDragStart={e => onDragStart(e, lead.id)}
                        onDragEnd={() => setDragging(null)}
                        className={`bg-white border border-border rounded-xl p-4 cursor-grab active:cursor-grabbing shadow-soft hover:shadow-card transition-all ${dragging === lead.id ? 'opacity-50' : ''}`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="font-medium text-sm text-ink leading-tight">{lead.name}</div>
                          <GripVertical size={14} className="text-ink-soft/30 shrink-0 mt-0.5" />
                        </div>

                        {lead.interest && (
                          <p className="text-xs text-ink-soft/70 mb-2 line-clamp-2">{lead.interest}</p>
                        )}

                        {lead.deal_value > 0 && (
                          <p className="text-xs font-semibold text-terra mb-2">{money(lead.deal_value)}</p>
                        )}

                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-border">
                          <div className="flex items-center gap-1">
                            <span title={lead.source} className="text-sm">{SOURCE_LABELS[lead.source] || '•'}</span>
                            <span className="text-[10px] text-ink-soft/50">{timeAgo(lead.last_contact_at)}</span>
                          </div>
                          <div className="flex gap-0.5">
                            {lead.phone && (
                              <a
                                href={`https://wa.me/${lead.phone.replace(/\D/g,'').padStart(12,'55')}?text=${encodeURIComponent(`Olá ${lead.name.split(' ')[0]}! Aqui é o Beto Baltazar, Corretor de Imóveis. Tudo bem?`)}`}
                                target="_blank"
                                className="p-1.5 hover:bg-cream rounded text-ink-soft hover:text-green transition"
                              >
                                <MessageCircle size={13} />
                              </a>
                            )}
                            <Link href={`/admin/crm/${lead.id}`} className="p-1.5 hover:bg-cream rounded text-ink-soft hover:text-terra transition">
                              <Edit2 size={13} />
                            </Link>
                            <button onClick={() => deleteLead(lead.id, lead.name)} className="p-1.5 hover:bg-cream rounded text-ink-soft hover:text-red transition">
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>

                        {/* Mover para estágio */}
                        <select
                          value={lead.stage}
                          onChange={e => moveToStage(lead.id, e.target.value)}
                          className="w-full mt-2 text-xs border border-border rounded-lg px-2 py-1 bg-cream text-ink-soft focus:outline-none focus:border-terra"
                        >
                          {stages.map(s => <option key={s}>{s}</option>)}
                        </select>
                      </div>
                    ))}

                    {stageLeads.length === 0 && (
                      <div className="text-center py-6 text-xs text-ink-soft/40">
                        Arraste leads aqui
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={() => setView('kanban')} className="btn-outline btn-sm">Kanban</button>
        <button onClick={() => setView('list')} className="btn-secondary btn-sm">Lista</button>
      </div>
      <div className="card-base overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-cream border-b border-border">
              {['Nome','Interesse','Fonte','Estágio','Contato','Ações'].map(h => (
                <th key={h} className="text-left px-5 py-3 text-[10px] tracking-widest text-ink-soft/60 uppercase font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {leads.map(lead => (
              <tr key={lead.id} className="hover:bg-cream/30 transition">
                <td className="px-5 py-3.5">
                  <div className="font-medium text-ink">{lead.name}</div>
                  {lead.deal_value > 0 && <div className="text-xs text-terra">{money(lead.deal_value)}</div>}
                </td>
                <td className="px-5 py-3.5 text-xs text-ink-soft max-w-[180px] truncate">{lead.interest || '—'}</td>
                <td className="px-5 py-3.5 text-xs text-ink-soft">{SOURCE_LABELS[lead.source]} {lead.source}</td>
                <td className="px-5 py-3.5">
                  <select
                    value={lead.stage}
                    onChange={e => moveToStage(lead.id, e.target.value)}
                    className="text-xs border border-border rounded-lg px-2 py-1 bg-white focus:outline-none focus:border-terra"
                  >
                    {stages.map(s => <option key={s}>{s}</option>)}
                  </select>
                </td>
                <td className="px-5 py-3.5 text-xs text-ink-soft/60">{timeAgo(lead.last_contact_at)}</td>
                <td className="px-5 py-3.5">
                  <div className="flex gap-1">
                    {lead.phone && (
                      <a href={`https://wa.me/${lead.phone.replace(/\D/g,'').padStart(12,'55')}`} target="_blank" className="p-1.5 hover:bg-cream rounded text-ink-soft hover:text-green transition"><MessageCircle size={14} /></a>
                    )}
                    <Link href={`/admin/crm/${lead.id}`} className="p-1.5 hover:bg-cream rounded text-ink-soft hover:text-terra transition"><Edit2 size={14} /></Link>
                    <button onClick={() => deleteLead(lead.id, lead.name)} className="p-1.5 hover:bg-cream rounded text-ink-soft hover:text-red transition"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
