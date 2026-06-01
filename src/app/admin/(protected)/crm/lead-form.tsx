'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, Save, Loader2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const STAGES = ['Novo Lead', 'Contato Feito', 'Visita Agendada', 'Proposta', 'Negociação', 'Fechado', 'Perdido'];
const SOURCES = ['Site', 'WhatsApp', 'Indicação', 'Portal', 'Instagram', 'Facebook', 'Telefone', 'Outro'];

export default function LeadForm({ initial, properties }: { initial?: any; properties: any[] }) {
  const router = useRouter();
  const isEdit = !!initial;
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: initial?.name || '',
    phone: initial?.phone || '',
    email: initial?.email || '',
    interest: initial?.interest || '',
    property_id: initial?.property_id || '',
    stage: initial?.stage || 'Novo Lead',
    source: initial?.source || 'Site',
    deal_value: initial?.deal_value || 0,
    notes: initial?.notes || '',
  });

  const u = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('Nome obrigatório'); return; }
    setLoading(true);
    const supabase = createClient();
    const payload = { ...form, property_id: form.property_id || null, last_contact_at: new Date().toISOString() };
    if (isEdit) {
      const { error } = await supabase.from('leads').update(payload).eq('id', initial.id);
      if (error) { toast.error('Erro: ' + error.message); setLoading(false); return; }
      toast.success('Lead atualizado!');
    } else {
      const { error } = await supabase.from('leads').insert(payload);
      if (error) { toast.error('Erro: ' + error.message); setLoading(false); return; }
      toast.success('Lead cadastrado!');
    }
    router.push('/admin/crm');
    router.refresh();
  }

  async function onDelete() {
    if (!confirm(`Excluir lead "${initial.name}"?`)) return;
    const supabase = createClient();
    const { error } = await supabase.from('leads').delete().eq('id', initial.id);
    if (error) { toast.error('Erro ao excluir'); return; }
    toast.success('Lead excluído!');
    router.push('/admin/crm');
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 max-w-2xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <Link href="/admin/crm" className="text-sm text-ink-soft hover:text-terra flex items-center gap-1.5"><ArrowLeft size={14} /> Voltar</Link>
        <div className="flex gap-2">
          {isEdit && <button type="button" onClick={onDelete} className="btn-outline text-red hover:bg-red/5 hover:border-red"><Trash2 size={14} /> Excluir</button>}
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}{isEdit ? 'Salvar' : 'Cadastrar'}
          </button>
        </div>
      </div>

      <div className="card-base p-6 space-y-4">
        <h3 className="font-display text-lg font-semibold">Dados do lead</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="field-label">Nome *</label>
            <input className="field-input" value={form.name} onChange={e => u('name', e.target.value)} required placeholder="Nome do interessado" />
          </div>
          <div>
            <label className="field-label">Telefone / WhatsApp</label>
            <input className="field-input" value={form.phone} onChange={e => u('phone', e.target.value)} placeholder="(15) 99999-9999" />
          </div>
          <div>
            <label className="field-label">E-mail</label>
            <input type="email" className="field-input" value={form.email} onChange={e => u('email', e.target.value)} placeholder="email@exemplo.com" />
          </div>
        </div>
      </div>

      <div className="card-base p-6 space-y-4">
        <h3 className="font-display text-lg font-semibold">Interesse e funil</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="field-label">Estágio no funil</label>
            <select className="field-input" value={form.stage} onChange={e => u('stage', e.target.value)}>
              {STAGES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="field-label">Origem do lead</label>
            <select className="field-input" value={form.source} onChange={e => u('source', e.target.value)}>
              {SOURCES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="field-label">Interesse (o que está buscando)</label>
            <input className="field-input" value={form.interest} onChange={e => u('interest', e.target.value)} placeholder="Ex: Casa 3 quartos no centro para compra até R$ 400k" />
          </div>
          <div>
            <label className="field-label">Imóvel de interesse</label>
            <select className="field-input" value={form.property_id} onChange={e => u('property_id', e.target.value)}>
              <option value="">— Sem imóvel específico —</option>
              {properties.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
            </select>
          </div>
          <div>
            <label className="field-label">Valor potencial do negócio (R$)</label>
            <input type="number" min="0" className="field-input" value={form.deal_value} onChange={e => u('deal_value', Number(e.target.value))} />
          </div>
        </div>
      </div>

      <div className="card-base p-6 space-y-4">
        <h3 className="font-display text-lg font-semibold">Anotações</h3>
        <textarea className="field-textarea" rows={4} value={form.notes} onChange={e => u('notes', e.target.value)} placeholder="Histórico de contatos, preferências, observações importantes..." />
      </div>

      <div className="flex justify-end gap-2">
        <Link href="/admin/crm" className="btn-outline">Cancelar</Link>
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}{isEdit ? 'Salvar' : 'Cadastrar'}
        </button>
      </div>
    </form>
  );
}
