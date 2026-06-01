'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, ArrowRight, Save, Loader2, Plus, Trash2, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const CONDITIONS = ['Ótimo', 'Bom', 'Regular', 'Ruim', 'Péssimo'];
const CONDITION_COLORS: Record<string, string> = {
  'Ótimo': 'bg-green text-white',
  'Bom': 'bg-moss text-white',
  'Regular': 'bg-yellow text-white',
  'Ruim': 'bg-terra text-white',
  'Péssimo': 'bg-red text-white',
};

const DEFAULT_ROOMS = [
  { room: 'Sala', items: ['Piso', 'Paredes', 'Teto', 'Portas', 'Janelas', 'Tomadas/Interruptores'] },
  { room: 'Cozinha', items: ['Piso', 'Paredes', 'Teto', 'Armários', 'Torneira', 'Tomadas'] },
  { room: 'Quarto 1', items: ['Piso', 'Paredes', 'Teto', 'Porta', 'Janela', 'Armário'] },
  { room: 'Banheiro', items: ['Piso', 'Paredes', 'Teto', 'Vaso sanitário', 'Pia', 'Chuveiro', 'Torneira'] },
  { room: 'Área de Serviço', items: ['Piso', 'Paredes', 'Tanque', 'Torneira'] },
  { room: 'Área Externa', items: ['Portão', 'Calçada', 'Muro/Cerca', 'Garagem'] },
];

interface InspectionItem {
  room: string;
  item: string;
  condition: string;
  notes: string;
}

export default function VistoriaWizard({ properties, tenants }: { properties: any[]; tenants: any[] }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1 — dados gerais
  const [header, setHeader] = useState({
    property_id: '',
    tenant_id: '',
    inspection_type: 'Entrada',
    inspection_date: new Date().toISOString().split('T')[0],
    inspector_name: 'Beto Baltazar',
    general_notes: '',
  });

  // Step 2 — itens por cômodo
  const [items, setItems] = useState<InspectionItem[]>(() =>
    DEFAULT_ROOMS.flatMap(r => r.items.map(item => ({ room: r.room, item, condition: 'Bom', notes: '' })))
  );
  const [customRoom, setCustomRoom] = useState('');
  const [customItem, setCustomItem] = useState('');

  const rooms = [...new Set(items.map(i => i.room))];

  function updateItem(idx: number, k: keyof InspectionItem, v: string) {
    setItems(prev => prev.map((item, i) => i === idx ? { ...item, [k]: v } : item));
  }

  function addCustomItem() {
    if (!customRoom || !customItem) { toast.error('Informe o cômodo e o item'); return; }
    setItems(prev => [...prev, { room: customRoom, item: customItem, condition: 'Bom', notes: '' }]);
    setCustomItem('');
    toast.success('Item adicionado');
  }

  function removeItem(idx: number) {
    setItems(prev => prev.filter((_, i) => i !== idx));
  }

  async function onSave(status: 'Em Andamento' | 'Concluído') {
    if (!header.property_id) { toast.error('Selecione o imóvel'); return; }
    setLoading(true);
    const supabase = createClient();

    const { data: inspection, error: inspErr } = await supabase
      .from('inspections')
      .insert({ ...header, tenant_id: header.tenant_id || null, status })
      .select()
      .single();

    if (inspErr || !inspection) { toast.error('Erro ao salvar: ' + inspErr?.message); setLoading(false); return; }

    if (items.length > 0) {
      const { error: itemsErr } = await supabase.from('inspection_items').insert(
        items.map((item, i) => ({ ...item, inspection_id: inspection.id, display_order: i }))
      );
      if (itemsErr) { toast.error('Erro ao salvar itens'); setLoading(false); return; }
    }

    toast.success(status === 'Concluído' ? 'Laudo concluído!' : 'Vistoria salva!');
    router.push(`/admin/vistorias/${inspection.id}`);
    router.refresh();
  }

  return (
    <div className="max-w-4xl space-y-6">
      {/* Progress */}
      <div className="flex items-center gap-2">
        {['Dados gerais', 'Itens do laudo', 'Revisão'].map((label, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              step > i + 1 ? 'bg-green text-white' : step === i + 1 ? 'bg-terra text-white' : 'bg-cream border border-border text-ink-soft'
            }`}>
              {step > i + 1 ? <Check size={14} /> : i + 1}
            </div>
            <span className={`text-sm ${step === i + 1 ? 'font-medium text-ink' : 'text-ink-soft/60'}`}>{label}</span>
            {i < 2 && <div className="w-8 h-px bg-border" />}
          </div>
        ))}
      </div>

      {/* Step 1 — Dados gerais */}
      {step === 1 && (
        <div className="card-base p-6 space-y-5">
          <h3 className="font-display text-xl font-semibold">Dados da vistoria</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="field-label">Imóvel *</label>
              <select className="field-input" value={header.property_id} onChange={e => setHeader(p => ({ ...p, property_id: e.target.value }))}>
                <option value="">— Selecione o imóvel —</option>
                {properties.map(p => <option key={p.id} value={p.id}>{p.title} — {p.city}</option>)}
              </select>
            </div>
            <div>
              <label className="field-label">Inquilino</label>
              <select className="field-input" value={header.tenant_id} onChange={e => setHeader(p => ({ ...p, tenant_id: e.target.value }))}>
                <option value="">— Selecione —</option>
                {tenants.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div>
              <label className="field-label">Tipo de vistoria</label>
              <select className="field-input" value={header.inspection_type} onChange={e => setHeader(p => ({ ...p, inspection_type: e.target.value }))}>
                <option>Entrada</option>
                <option>Saída</option>
              </select>
            </div>
            <div>
              <label className="field-label">Data da vistoria</label>
              <input type="date" className="field-input" value={header.inspection_date} onChange={e => setHeader(p => ({ ...p, inspection_date: e.target.value }))} />
            </div>
            <div>
              <label className="field-label">Vistoriador</label>
              <input className="field-input" value={header.inspector_name} onChange={e => setHeader(p => ({ ...p, inspector_name: e.target.value }))} />
            </div>
            <div className="sm:col-span-2">
              <label className="field-label">Observações gerais</label>
              <textarea className="field-textarea" rows={3} value={header.general_notes} onChange={e => setHeader(p => ({ ...p, general_notes: e.target.value }))} placeholder="Condições gerais do imóvel, observações importantes..." />
            </div>
          </div>
          <div className="flex justify-between">
            <Link href="/admin/vistorias" className="btn-outline"><ArrowLeft size={14} /> Voltar</Link>
            <button onClick={() => { if (!header.property_id) { toast.error('Selecione o imóvel'); return; } setStep(2); }} className="btn-primary">
              Próximo: Itens do laudo <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Step 2 — Itens */}
      {step === 2 && (
        <div className="space-y-5">
          {rooms.map(room => (
            <div key={room} className="card-base p-5">
              <h4 className="font-display text-base font-semibold text-ink mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-terra inline-block" />
                {room}
              </h4>
              <div className="space-y-3">
                {items.map((item, idx) => item.room !== room ? null : (
                  <div key={idx} className="grid grid-cols-12 gap-3 items-start">
                    <div className="col-span-3">
                      <p className="text-sm text-ink font-medium pt-2.5">{item.item}</p>
                    </div>
                    <div className="col-span-4">
                      <div className="flex gap-1 flex-wrap">
                        {CONDITIONS.map(c => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => updateItem(idx, 'condition', c)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition border ${
                              item.condition === c ? CONDITION_COLORS[c] + ' border-transparent' : 'bg-white border-border text-ink-soft hover:border-terra/40'
                            }`}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="col-span-4">
                      <input
                        className="field-input text-xs"
                        placeholder="Observação..."
                        value={item.notes}
                        onChange={e => updateItem(idx, 'notes', e.target.value)}
                      />
                    </div>
                    <div className="col-span-1 flex justify-end pt-2">
                      <button onClick={() => removeItem(idx)} className="p-1.5 text-ink-soft/40 hover:text-red transition">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Adicionar item custom */}
          <div className="card-base p-5">
            <h4 className="font-display text-base font-semibold text-ink mb-4">Adicionar item</h4>
            <div className="flex gap-3 flex-wrap">
              <input className="field-input w-40" placeholder="Cômodo" value={customRoom} onChange={e => setCustomRoom(e.target.value)} list="rooms-list" />
              <datalist id="rooms-list">{rooms.map(r => <option key={r} value={r} />)}</datalist>
              <input className="field-input w-48" placeholder="Item (ex: Forro)" value={customItem} onChange={e => setCustomItem(e.target.value)} />
              <button onClick={addCustomItem} className="btn-outline"><Plus size={14} /> Adicionar</button>
            </div>
          </div>

          <div className="flex justify-between">
            <button onClick={() => setStep(1)} className="btn-outline"><ArrowLeft size={14} /> Voltar</button>
            <button onClick={() => setStep(3)} className="btn-primary">Revisar laudo <ArrowRight size={14} /></button>
          </div>
        </div>
      )}

      {/* Step 3 — Revisão */}
      {step === 3 && (
        <div className="space-y-5">
          <div className="card-base p-6">
            <h3 className="font-display text-xl font-semibold mb-4">Resumo do laudo</h3>
            <div className="grid sm:grid-cols-3 gap-4 mb-5">
              {[
                { l: 'Imóvel', v: properties.find(p => p.id === header.property_id)?.title },
                { l: 'Tipo', v: header.inspection_type },
                { l: 'Data', v: header.inspection_date },
                { l: 'Inquilino', v: tenants.find(t => t.id === header.tenant_id)?.name || '—' },
                { l: 'Total de itens', v: items.length },
                { l: 'Vistoriador', v: header.inspector_name },
              ].map(item => (
                <div key={item.l}>
                  <p className="text-xs text-ink-soft/60 mb-0.5">{item.l}</p>
                  <p className="text-sm font-medium text-ink">{item.v}</p>
                </div>
              ))}
            </div>

            {/* Resumo por condição */}
            <div className="border-t border-border pt-4">
              <p className="text-xs text-ink-soft/60 mb-3">Distribuição de condições</p>
              <div className="flex gap-3 flex-wrap">
                {CONDITIONS.map(c => {
                  const count = items.filter(i => i.condition === c).length;
                  if (!count) return null;
                  return (
                    <div key={c} className={`badge ${CONDITION_COLORS[c]} border-0 px-3 py-1`}>
                      {c}: {count}
                    </div>
                  );
                })}
              </div>
            </div>

            {header.general_notes && (
              <div className="border-t border-border pt-4 mt-4">
                <p className="text-xs text-ink-soft/60 mb-1">Observações gerais</p>
                <p className="text-sm text-ink">{header.general_notes}</p>
              </div>
            )}
          </div>

          <div className="flex justify-between flex-wrap gap-3">
            <button onClick={() => setStep(2)} className="btn-outline"><ArrowLeft size={14} /> Voltar</button>
            <div className="flex gap-3">
              <button onClick={() => onSave('Em Andamento')} disabled={loading} className="btn-outline">
                {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Salvar rascunho
              </button>
              <button onClick={() => onSave('Concluído')} disabled={loading} className="btn-primary">
                {loading ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Concluir laudo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
