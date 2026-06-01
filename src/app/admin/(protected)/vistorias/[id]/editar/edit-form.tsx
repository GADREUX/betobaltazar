'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, Save, Loader2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function VistoriaEditForm({ initial, properties, tenants }: { initial: any; properties: any[]; tenants: any[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    property_id: initial.property_id || '',
    tenant_id: initial.tenant_id || '',
    inspection_type: initial.inspection_type || 'Entrada',
    inspection_date: initial.inspection_date || '',
    inspector_name: initial.inspector_name || 'Beto Baltazar',
    status: initial.status || 'Em Andamento',
    general_notes: initial.general_notes || '',
  });

  const u = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.from('inspections').update({ ...form, tenant_id: form.tenant_id || null }).eq('id', initial.id);
    if (error) { toast.error('Erro: ' + error.message); setLoading(false); return; }
    toast.success('Vistoria atualizada!');
    router.push(`/admin/vistorias/${initial.id}`);
    router.refresh();
  }

  async function onDelete() {
    if (!confirm('Excluir esta vistoria?')) return;
    const supabase = createClient();
    await supabase.from('inspections').delete().eq('id', initial.id);
    toast.success('Excluído!');
    router.push('/admin/vistorias');
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 max-w-2xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <Link href={`/admin/vistorias/${initial.id}`} className="text-sm text-ink-soft hover:text-terra flex items-center gap-1.5"><ArrowLeft size={14} /> Voltar</Link>
        <div className="flex gap-2">
          <button type="button" onClick={onDelete} className="btn-outline text-red hover:bg-red/5 hover:border-red"><Trash2 size={14} /> Excluir</button>
          <button type="submit" disabled={loading} className="btn-primary">{loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Salvar</button>
        </div>
      </div>
      <div className="card-base p-6 space-y-4">
        <h3 className="font-display text-lg font-semibold">Dados gerais</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="field-label">Imóvel</label>
            <select className="field-input" value={form.property_id} onChange={e => u('property_id', e.target.value)}>
              <option value="">— Selecione —</option>
              {properties.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
            </select>
          </div>
          <div>
            <label className="field-label">Inquilino</label>
            <select className="field-input" value={form.tenant_id} onChange={e => u('tenant_id', e.target.value)}>
              <option value="">— Selecione —</option>
              {tenants.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div>
            <label className="field-label">Tipo</label>
            <select className="field-input" value={form.inspection_type} onChange={e => u('inspection_type', e.target.value)}>
              <option>Entrada</option><option>Saída</option>
            </select>
          </div>
          <div>
            <label className="field-label">Data</label>
            <input type="date" className="field-input" value={form.inspection_date} onChange={e => u('inspection_date', e.target.value)} />
          </div>
          <div>
            <label className="field-label">Status</label>
            <select className="field-input" value={form.status} onChange={e => u('status', e.target.value)}>
              <option>Em Andamento</option><option>Concluído</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="field-label">Observações gerais</label>
            <textarea className="field-textarea" rows={3} value={form.general_notes} onChange={e => u('general_notes', e.target.value)} />
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Link href={`/admin/vistorias/${initial.id}`} className="btn-outline">Cancelar</Link>
        <button type="submit" disabled={loading} className="btn-primary">{loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Salvar</button>
      </div>
    </form>
  );
}
