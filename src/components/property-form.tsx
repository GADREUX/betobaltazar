'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import PhotoUploader from '@/components/photo-uploader';

const TYPES = ['Casa','Apartamento','Terreno','Comercial','Rural','Cobertura','Kitnet','Sobrado'];
const PURPOSES = ['Venda','Locação','Venda e Locação'];
const STATUSES = ['Disponível','Reservado','Vendido','Alugado'];
const FEATURES = ['Piscina','Churrasqueira','Suíte','Quintal','Garagem coberta','Cozinha planejada','Armários planejados','Área de serviço','Edícula','Portão eletrônico','Mobiliado','Aceita pets'];

export default function PropertyForm({ initial, owners }: { initial?: any; owners: any[] }) {
  const router = useRouter();
  const isEdit = !!initial;
  const [form, setForm] = useState({
    code: initial?.code || '', title: initial?.title || '', type: initial?.type || 'Casa',
    purpose: initial?.purpose || 'Venda', status: initial?.status || 'Disponível',
    price: initial?.price || 0, rent: initial?.rent || 0, area: initial?.area || 0,
    bedrooms: initial?.bedrooms || 0, suites: initial?.suites || 0, bathrooms: initial?.bathrooms || 0,
    parking: initial?.parking || 0, address: initial?.address || '', neighborhood: initial?.neighborhood || '',
    city: initial?.city || 'Capão Bonito', state: initial?.state || 'SP', cep: initial?.cep || '',
    description: initial?.description || '', features: initial?.features || [],
    photos: initial?.photos || [], iptu: initial?.iptu || 0, condo_fee: initial?.condo_fee || 0,
    owner_id: initial?.owner_id || '', is_featured: initial?.is_featured || false,
    is_published: initial?.is_published ?? true,
  });
  const [loading, setLoading] = useState(false);
  const u = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }));
  const toggleFeature = (f: string) => setForm(p => ({ ...p, features: p.features.includes(f) ? p.features.filter((x: string) => x !== f) : [...p.features, f] }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) { toast.error('Título obrigatório'); return; }
    setLoading(true);
    const supabase = createClient();
    const payload = { ...form, owner_id: form.owner_id || null, code: form.code || null };
    if (isEdit) {
      const { error } = await supabase.from('properties').update(payload).eq('id', initial.id);
      if (error) { toast.error('Erro: ' + error.message); setLoading(false); return; }
      toast.success('Imóvel atualizado!');
    } else {
      const { error } = await supabase.from('properties').insert(payload);
      if (error) { toast.error(error.message.includes('Limite') ? 'Limite de 50 imóveis atingido!' : 'Erro: ' + error.message); setLoading(false); return; }
      toast.success('Imóvel cadastrado!');
    }
    router.push('/admin/imoveis'); router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 max-w-4xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <Link href="/admin/imoveis" className="text-sm text-ink-soft hover:text-terra flex items-center gap-1.5"><ArrowLeft size={14} /> Voltar</Link>
        <button type="submit" disabled={loading} className="btn-primary">{loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}{isEdit ? 'Salvar' : 'Cadastrar'}</button>
      </div>

      {/* Identificação */}
      <div className="card-base p-6 space-y-4">
        <h3 className="font-display text-lg font-semibold">Identificação</h3>
        <div className="grid sm:grid-cols-12 gap-4">
          <div className="sm:col-span-2"><label className="field-label">Código</label><input className="field-input" value={form.code} onChange={e => u('code', e.target.value)} placeholder="001" /></div>
          <div className="sm:col-span-10"><label className="field-label">Título *</label><input className="field-input" value={form.title} onChange={e => u('title', e.target.value)} required placeholder="Casa Térrea de Alto Padrão..." /></div>
          <div className="sm:col-span-4"><label className="field-label">Tipo</label><select className="field-input" value={form.type} onChange={e => u('type', e.target.value)}>{TYPES.map(t => <option key={t}>{t}</option>)}</select></div>
          <div className="sm:col-span-4"><label className="field-label">Finalidade</label><select className="field-input" value={form.purpose} onChange={e => u('purpose', e.target.value)}>{PURPOSES.map(t => <option key={t}>{t}</option>)}</select></div>
          <div className="sm:col-span-4"><label className="field-label">Status</label><select className="field-input" value={form.status} onChange={e => u('status', e.target.value)}>{STATUSES.map(t => <option key={t}>{t}</option>)}</select></div>
        </div>
      </div>

      {/* Valores */}
      <div className="card-base p-6 space-y-4">
        <h3 className="font-display text-lg font-semibold">Valores</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {(form.purpose === 'Venda' || form.purpose === 'Venda e Locação') && <div><label className="field-label">Preço de venda (R$)</label><input type="number" min="0" className="field-input" value={form.price} onChange={e => u('price', Number(e.target.value))} /></div>}
          {(form.purpose === 'Locação' || form.purpose === 'Venda e Locação') && <div><label className="field-label">Aluguel (R$/mês)</label><input type="number" min="0" className="field-input" value={form.rent} onChange={e => u('rent', Number(e.target.value))} /></div>}
          <div><label className="field-label">IPTU anual (R$)</label><input type="number" min="0" className="field-input" value={form.iptu} onChange={e => u('iptu', Number(e.target.value))} /></div>
          <div><label className="field-label">Condomínio (R$/mês)</label><input type="number" min="0" className="field-input" value={form.condo_fee} onChange={e => u('condo_fee', Number(e.target.value))} /></div>
        </div>
      </div>

      {/* Características */}
      <div className="card-base p-6 space-y-4">
        <h3 className="font-display text-lg font-semibold">Características</h3>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {[{l:'Quartos',k:'bedrooms'},{l:'Suítes',k:'suites'},{l:'Banheiros',k:'bathrooms'},{l:'Vagas',k:'parking'},{l:'Área (m²)',k:'area'},{l:'Terreno (m²)',k:'lot_area'}].map(f => (
            <div key={f.k}><label className="field-label">{f.l}</label><input type="number" min="0" className="field-input" value={(form as any)[f.k] || 0} onChange={e => u(f.k, Number(e.target.value))} /></div>
          ))}
        </div>
      </div>

      {/* Localização */}
      <div className="card-base p-6 space-y-4">
        <h3 className="font-display text-lg font-semibold">Localização</h3>
        <div className="grid sm:grid-cols-12 gap-4">
          <div className="sm:col-span-3"><label className="field-label">CEP</label><input className="field-input" value={form.cep} onChange={e => u('cep', e.target.value)} placeholder="18300-000" /></div>
          <div className="sm:col-span-9"><label className="field-label">Endereço</label><input className="field-input" value={form.address} onChange={e => u('address', e.target.value)} placeholder="Rua, número" /></div>
          <div className="sm:col-span-5"><label className="field-label">Bairro</label><input className="field-input" value={form.neighborhood} onChange={e => u('neighborhood', e.target.value)} /></div>
          <div className="sm:col-span-5"><label className="field-label">Cidade</label><input className="field-input" value={form.city} onChange={e => u('city', e.target.value)} /></div>
          <div className="sm:col-span-2"><label className="field-label">UF</label><input className="field-input" value={form.state} onChange={e => u('state', e.target.value)} maxLength={2} /></div>
        </div>
      </div>

      {/* Descrição */}
      <div className="card-base p-6 space-y-4">
        <h3 className="font-display text-lg font-semibold">Descrição e diferenciais</h3>
        <div><label className="field-label">Descrição</label><textarea className="field-textarea" rows={4} value={form.description} onChange={e => u('description', e.target.value)} placeholder="Descreva o imóvel..." /></div>
        <div><label className="field-label">Características</label><div className="flex flex-wrap gap-2 mt-1">{FEATURES.map(f => <button key={f} type="button" onClick={() => toggleFeature(f)} className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${form.features.includes(f) ? 'bg-terra text-white border-terra' : 'bg-white text-ink-soft border-border hover:border-terra/40'}`}>{f}</button>)}</div></div>
      </div>

      {/* Fotos */}
      <div className="card-base p-6 space-y-4">
        <h3 className="font-display text-lg font-semibold">Fotos do imóvel</h3>
        <PhotoUploader photos={form.photos} onChange={(photos) => u('photos', photos)} />
      </div>

      {/* Proprietário + Publicação */}
      <div className="card-base p-6 space-y-4">
        <h3 className="font-display text-lg font-semibold">Proprietário e publicação</h3>
        <div><label className="field-label">Proprietário</label><select className="field-input" value={form.owner_id || ''} onChange={e => u('owner_id', e.target.value)}><option value="">— Sem vínculo —</option>{owners.map((o: any) => <option key={o.id} value={o.id}>{o.name}</option>)}</select></div>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer text-sm"><input type="checkbox" checked={form.is_published} onChange={e => u('is_published', e.target.checked)} className="w-4 h-4 accent-terra" /> Publicar no site</label>
          <label className="flex items-center gap-2 cursor-pointer text-sm"><input type="checkbox" checked={form.is_featured} onChange={e => u('is_featured', e.target.checked)} className="w-4 h-4 accent-terra" /> Destacar na home</label>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Link href="/admin/imoveis" className="btn-outline">Cancelar</Link>
        <button type="submit" disabled={loading} className="btn-primary">{loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}{isEdit ? 'Salvar' : 'Cadastrar'}</button>
      </div>
    </form>
  );
}
