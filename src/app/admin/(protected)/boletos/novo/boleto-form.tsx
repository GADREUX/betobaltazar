'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { money } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function BoletoForm({ contracts, tenants, properties }: { contracts: any[]; tenants: any[]; properties: any[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    contract_id: '',
    tenant_id: '',
    property_id: '',
    value: 0,
    due_date: '',
    notes: '',
  });

  const u = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }));

  function onContractChange(contractId: string) {
    const contract = contracts.find(c => c.id === contractId);
    if (contract) {
      u('contract_id', contractId);
      setForm(p => ({
        ...p,
        contract_id: contractId,
        tenant_id: contract.tenants?.id || '',
        value: contract.rent_value || 0,
      }));
    } else {
      u('contract_id', contractId);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.due_date || !form.value) { toast.error('Preencha data de vencimento e valor'); return; }
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.from('boletos').insert({
      contract_id: form.contract_id || null,
      tenant_id: form.tenant_id || null,
      property_id: form.property_id || null,
      value: form.value,
      due_date: form.due_date,
      notes: form.notes || null,
      status: 'Pendente',
    });
    if (error) { toast.error('Erro: ' + error.message); setLoading(false); return; }
    toast.success('Boleto gerado!');
    router.push('/admin/boletos');
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 max-w-2xl">
      <div className="flex items-center justify-between">
        <Link href="/admin/boletos" className="text-sm text-ink-soft hover:text-terra flex items-center gap-1.5"><ArrowLeft size={14} /> Voltar</Link>
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Gerar boleto
        </button>
      </div>

      <div className="card-base p-6 space-y-4">
        <h3 className="font-display text-lg font-semibold">Vincular contrato (opcional)</h3>
        <p className="text-xs text-ink-soft/60">Selecione um contrato ativo para preencher automaticamente os dados.</p>
        <select className="field-input" value={form.contract_id} onChange={e => onContractChange(e.target.value)}>
          <option value="">— Sem contrato vinculado —</option>
          {contracts.map((c: any) => (
            <option key={c.id} value={c.id}>
              {c.properties?.title} · {c.tenants?.name} · {money(c.rent_value)}/mês
            </option>
          ))}
        </select>
      </div>

      <div className="card-base p-6 space-y-4">
        <h3 className="font-display text-lg font-semibold">Dados da cobrança</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="field-label">Inquilino</label>
            <select className="field-input" value={form.tenant_id} onChange={e => u('tenant_id', e.target.value)}>
              <option value="">— Selecione —</option>
              {tenants.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div>
            <label className="field-label">Imóvel</label>
            <select className="field-input" value={form.property_id} onChange={e => u('property_id', e.target.value)}>
              <option value="">— Selecione —</option>
              {properties.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
            </select>
          </div>
          <div>
            <label className="field-label">Valor (R$) *</label>
            <input type="number" min="0" step="0.01" className="field-input" value={form.value} onChange={e => u('value', Number(e.target.value))} required />
          </div>
          <div>
            <label className="field-label">Data de vencimento *</label>
            <input type="date" className="field-input" value={form.due_date} onChange={e => u('due_date', e.target.value)} required />
          </div>
          <div className="sm:col-span-2">
            <label className="field-label">Observações</label>
            <textarea className="field-textarea" rows={2} value={form.notes} onChange={e => u('notes', e.target.value)} placeholder="Ex: Aluguel referente ao mês de junho/2026" />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Link href="/admin/boletos" className="btn-outline">Cancelar</Link>
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Gerar boleto
        </button>
      </div>
    </form>
  );
}
