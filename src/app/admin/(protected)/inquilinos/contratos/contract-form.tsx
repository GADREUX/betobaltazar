'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, Save, Loader2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const INDEXES = ['IGPM', 'IPCA', 'INPC', 'Fixo'];
const STATUSES = ['Ativo', 'Pendente', 'Encerrado'];
const CONTRACT_TYPES = ['Locação Residencial', 'Locação Comercial', 'Locação Rural'];

export default function ContractForm({ initial, properties, owners, tenants }: {
  initial?: any;
  properties: any[];
  owners: any[];
  tenants: any[];
}) {
  const router = useRouter();
  const isEdit = !!initial;
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    property_id: initial?.property_id || '',
    owner_id: initial?.owner_id || '',
    tenant_id: initial?.tenant_id || '',
    contract_type: initial?.contract_type || 'Locação Residencial',
    rent_value: initial?.rent_value || 0,
    deposit: initial?.deposit || 0,
    readjustment_index: initial?.readjustment_index || 'IGPM',
    start_date: initial?.start_date || '',
    end_date: initial?.end_date || '',
    payment_day: initial?.payment_day || 10,
    status: initial?.status || 'Ativo',
    clauses: initial?.clauses || '',
  });

  const u = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.property_id || !form.tenant_id || !form.rent_value || !form.start_date || !form.end_date) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const payload = { ...form, owner_id: form.owner_id || null };
    if (isEdit) {
      const { error } = await supabase.from('contracts').update(payload).eq('id', initial.id);
      if (error) { toast.error('Erro: ' + error.message); setLoading(false); return; }
      toast.success('Contrato atualizado!');
    } else {
      const { error } = await supabase.from('contracts').insert(payload);
      if (error) { toast.error('Erro: ' + error.message); setLoading(false); return; }
      toast.success('Contrato cadastrado!');
    }
    router.push('/admin/contratos');
    router.refresh();
  }

  async function onDelete() {
    if (!confirm('Excluir este contrato? Os boletos vinculados também serão excluídos.')) return;
    const supabase = createClient();
    const { error } = await supabase.from('contracts').delete().eq('id', initial.id);
    if (error) { toast.error('Erro ao excluir'); return; }
    toast.success('Contrato excluído!');
    router.push('/admin/contratos');
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 max-w-3xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <Link href="/admin/contratos" className="text-sm text-ink-soft hover:text-terra flex items-center gap-1.5"><ArrowLeft size={14} /> Voltar</Link>
        <div className="flex gap-2">
          {isEdit && (
            <button type="button" onClick={onDelete} className="btn-outline text-red hover:bg-red/5 hover:border-red">
              <Trash2 size={14} /> Excluir
            </button>
          )}
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {isEdit ? 'Salvar' : 'Cadastrar'}
          </button>
        </div>
      </div>

      {/* Partes */}
      <div className="card-base p-6 space-y-4">
        <h3 className="font-display text-lg font-semibold">Partes envolvidas</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="field-label">Imóvel *</label>
            <select className="field-input" value={form.property_id} onChange={e => u('property_id', e.target.value)} required>
              <option value="">— Selecione o imóvel —</option>
              {properties.map(p => <option key={p.id} value={p.id}>{p.title} — {p.city}</option>)}
            </select>
          </div>
          <div>
            <label className="field-label">Proprietário</label>
            <select className="field-input" value={form.owner_id} onChange={e => u('owner_id', e.target.value)}>
              <option value="">— Selecione —</option>
              {owners.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
            </select>
          </div>
          <div>
            <label className="field-label">Inquilino *</label>
            <select className="field-input" value={form.tenant_id} onChange={e => u('tenant_id', e.target.value)} required>
              <option value="">— Selecione —</option>
              {tenants.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Valores */}
      <div className="card-base p-6 space-y-4">
        <h3 className="font-display text-lg font-semibold">Valores e condições</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="field-label">Tipo de contrato</label>
            <select className="field-input" value={form.contract_type} onChange={e => u('contract_type', e.target.value)}>
              {CONTRACT_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="field-label">Status</label>
            <select className="field-input" value={form.status} onChange={e => u('status', e.target.value)}>
              {STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="field-label">Valor do aluguel (R$) *</label>
            <input type="number" min="0" step="0.01" className="field-input" value={form.rent_value} onChange={e => u('rent_value', Number(e.target.value))} required />
          </div>
          <div>
            <label className="field-label">Depósito caução (R$)</label>
            <input type="number" min="0" step="0.01" className="field-input" value={form.deposit} onChange={e => u('deposit', Number(e.target.value))} />
          </div>
          <div>
            <label className="field-label">Índice de reajuste</label>
            <select className="field-input" value={form.readjustment_index} onChange={e => u('readjustment_index', e.target.value)}>
              {INDEXES.map(i => <option key={i}>{i}</option>)}
            </select>
          </div>
          <div>
            <label className="field-label">Dia de vencimento</label>
            <input type="number" min="1" max="28" className="field-input" value={form.payment_day} onChange={e => u('payment_day', Number(e.target.value))} />
          </div>
        </div>
      </div>

      {/* Período */}
      <div className="card-base p-6 space-y-4">
        <h3 className="font-display text-lg font-semibold">Período do contrato</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="field-label">Data de início *</label>
            <input type="date" className="field-input" value={form.start_date} onChange={e => u('start_date', e.target.value)} required />
          </div>
          <div>
            <label className="field-label">Data de término *</label>
            <input type="date" className="field-input" value={form.end_date} onChange={e => u('end_date', e.target.value)} required />
          </div>
        </div>
      </div>

      {/* Cláusulas */}
      <div className="card-base p-6 space-y-4">
        <h3 className="font-display text-lg font-semibold">Cláusulas adicionais</h3>
        <p className="text-xs text-ink-soft/60">Cláusulas específicas deste contrato além das padrões.</p>
        <textarea
          className="field-textarea"
          rows={5}
          value={form.clauses}
          onChange={e => u('clauses', e.target.value)}
          placeholder="Ex: Proibida sublocação. Animais de pequeno porte permitidos mediante aprovação..."
        />
      </div>

      <div className="flex justify-end gap-2">
        <Link href="/admin/contratos" className="btn-outline">Cancelar</Link>
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          {isEdit ? 'Salvar' : 'Cadastrar'}
        </button>
      </div>
    </form>
  );
}
