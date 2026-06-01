'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { encryptSensitiveFields, SENSITIVE_FIELDS } from '@/lib/crypto';
import { ArrowLeft, Save, Loader2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function OwnerForm({ initial }: { initial?: any }) {
  const router = useRouter();
  const isEdit = !!initial;
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: initial?.name || '',
    cpf: initial?.cpf || '',
    rg: initial?.rg || '',
    phone: initial?.phone || '',
    email: initial?.email || '',
    address: initial?.address || '',
    bank_info: initial?.bank_info || '',
    notes: initial?.notes || '',
  });

  const u = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('Nome obrigatório'); return; }
    setLoading(true);
    const supabase = createClient();
    const encrypted = await encryptSensitiveFields(form, SENSITIVE_FIELDS.owners);
    if (isEdit) {
      const { error } = await supabase.from('owners').update(encrypted).eq('id', initial.id);
      if (error) { toast.error('Erro: ' + error.message); setLoading(false); return; }
      toast.success('Proprietário atualizado!');
    } else {
      const { error } = await supabase.from('owners').insert(encrypted);
      if (error) { toast.error('Erro: ' + error.message); setLoading(false); return; }
      toast.success('Proprietário cadastrado!');
    }
    router.push('/admin/proprietarios');
    router.refresh();
  }

  async function onDelete() {
    if (!confirm(`Excluir "${initial.name}"?`)) return;
    const supabase = createClient();
    const { error } = await supabase.from('owners').delete().eq('id', initial.id);
    if (error) { toast.error('Erro ao excluir'); return; }
    toast.success('Excluído!');
    router.push('/admin/proprietarios');
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 max-w-3xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <Link href="/admin/proprietarios" className="text-sm text-ink-soft hover:text-terra flex items-center gap-1.5"><ArrowLeft size={14} /> Voltar</Link>
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

      {/* Dados pessoais */}
      <div className="card-base p-6 space-y-4">
        <h3 className="font-display text-lg font-semibold">Dados pessoais</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="field-label">Nome completo *</label>
            <input className="field-input" value={form.name} onChange={e => u('name', e.target.value)} required placeholder="Nome do proprietário" />
          </div>
          <div>
            <label className="field-label">CPF</label>
            <input className="field-input" value={form.cpf} onChange={e => u('cpf', e.target.value)} placeholder="000.000.000-00" />
          </div>
          <div>
            <label className="field-label">RG</label>
            <input className="field-input" value={form.rg} onChange={e => u('rg', e.target.value)} placeholder="00.000.000-0" />
          </div>
        </div>
      </div>

      {/* Contato */}
      <div className="card-base p-6 space-y-4">
        <h3 className="font-display text-lg font-semibold">Contato</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="field-label">Telefone / WhatsApp</label>
            <input className="field-input" value={form.phone} onChange={e => u('phone', e.target.value)} placeholder="(15) 99999-9999" />
          </div>
          <div>
            <label className="field-label">E-mail</label>
            <input type="email" className="field-input" value={form.email} onChange={e => u('email', e.target.value)} placeholder="email@exemplo.com" />
          </div>
          <div className="sm:col-span-2">
            <label className="field-label">Endereço</label>
            <input className="field-input" value={form.address} onChange={e => u('address', e.target.value)} placeholder="Rua, número, bairro, cidade" />
          </div>
        </div>
      </div>

      {/* Dados bancários */}
      <div className="card-base p-6 space-y-4">
        <h3 className="font-display text-lg font-semibold">Dados bancários</h3>
        <p className="text-xs text-ink-soft/60">Para repasse de aluguéis. Informação confidencial.</p>
        <textarea
          className="field-textarea"
          rows={3}
          value={form.bank_info}
          onChange={e => u('bank_info', e.target.value)}
          placeholder="Banco, agência, conta, PIX..."
        />
      </div>

      {/* Observações */}
      <div className="card-base p-6 space-y-4">
        <h3 className="font-display text-lg font-semibold">Observações</h3>
        <textarea
          className="field-textarea"
          rows={3}
          value={form.notes}
          onChange={e => u('notes', e.target.value)}
          placeholder="Anotações internas sobre este proprietário..."
        />
      </div>

      <div className="flex justify-end gap-2">
        <Link href="/admin/proprietarios" className="btn-outline">Cancelar</Link>
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          {isEdit ? 'Salvar' : 'Cadastrar'}
        </button>
      </div>
    </form>
  );
}
