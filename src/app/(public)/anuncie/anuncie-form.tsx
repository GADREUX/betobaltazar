'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import emailjs from '@emailjs/browser';
import toast from 'react-hot-toast';
import { Send, Loader2, CheckCircle } from 'lucide-react';

export default function AnuncieForm() {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '', property_type: 'Casa', purpose: 'Venda', property_address: '', property_details: '', consent: false });
  const u = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.consent) { toast.error('Aceite os termos para continuar'); return; }
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.from('submissions').insert({ type: 'cadastro_imovel', name: form.name, phone: form.phone, email: form.email || null, property_type: form.property_type, purpose: form.purpose, property_address: form.property_address, property_details: form.property_details });
    if (error) { toast.error('Erro ao enviar. Tente novamente.'); setLoading(false); return; }
    try {
      const sid = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      const tid = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
      const pk = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
      if (sid && tid && pk) await emailjs.send(sid, tid, { from_name: form.name, phone: form.phone, email: form.email, property_type: form.property_type, purpose: form.purpose, address: form.property_address, details: form.property_details, type: 'Cadastro de Imóvel' }, { publicKey: pk });
    } catch {}
    setDone(true); setLoading(false); toast.success('Cadastro enviado!');
  }

  if (done) return (
    <div className="card-base p-12 text-center">
      <div className="w-20 h-20 rounded-full bg-green/10 flex items-center justify-center mx-auto mb-6"><CheckCircle className="text-green" size={40} strokeWidth={1.5} /></div>
      <h2 className="font-display text-3xl font-bold text-ink mb-3">Recebido!</h2>
      <p className="text-ink-soft/80 mb-6">Obrigado, <strong>{form.name.split(' ')[0]}</strong>. Entrarei em contato em breve pelo telefone {form.phone}.</p>
      <a href={`https://wa.me/5515996897738?text=Olá Beto! Acabei de cadastrar meu imóvel no site. Me chamo ${form.name}.`} target="_blank" className="btn-primary">Adiantar contato via WhatsApp</a>
    </div>
  );

  return (
    <form onSubmit={onSubmit} className="card-base p-8 space-y-5">
      <h2 className="font-display text-2xl font-bold text-ink">Seus dados</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        <div><label className="field-label">Nome *</label><input className="field-input" value={form.name} onChange={e => u('name', e.target.value)} required placeholder="Seu nome completo" /></div>
        <div><label className="field-label">WhatsApp *</label><input className="field-input" value={form.phone} onChange={e => u('phone', e.target.value)} required placeholder="(15) 99999-9999" /></div>
        <div><label className="field-label">E-mail</label><input type="email" className="field-input" value={form.email} onChange={e => u('email', e.target.value)} placeholder="seu@email.com" /></div>
      </div>
      <hr className="border-border" />
      <h2 className="font-display text-2xl font-bold text-ink">Sobre o imóvel</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        <div><label className="field-label">Tipo</label><select className="field-input" value={form.property_type} onChange={e => u('property_type', e.target.value)}>{['Casa','Apartamento','Terreno','Comercial','Rural','Cobertura','Kitnet','Sobrado'].map(t => <option key={t}>{t}</option>)}</select></div>
        <div><label className="field-label">Finalidade</label><select className="field-input" value={form.purpose} onChange={e => u('purpose', e.target.value)}>{['Venda','Locação','Ambos'].map(t => <option key={t}>{t}</option>)}</select></div>
      </div>
      <div><label className="field-label">Endereço *</label><input className="field-input" value={form.property_address} onChange={e => u('property_address', e.target.value)} required placeholder="Rua, número, bairro" /></div>
      <div><label className="field-label">Detalhes adicionais</label><textarea className="field-textarea" rows={3} value={form.property_details} onChange={e => u('property_details', e.target.value)} placeholder="Quartos, área, valor esperado, estado de conservação..." /></div>
      <label className="flex items-start gap-3 cursor-pointer">
        <input type="checkbox" checked={form.consent} onChange={e => u('consent', e.target.checked)} className="mt-0.5 w-4 h-4 accent-terra" />
        <span className="text-xs text-ink-soft/70">Concordo em ser contatado pelo Beto Baltazar Corretor conforme a LGPD.</span>
      </label>
      <button type="submit" disabled={loading} className="btn-primary btn-lg w-full sm:w-auto">
        {loading ? <><Loader2 size={16} className="animate-spin" /> Enviando...</> : <><Send size={15} /> Enviar cadastro</>}
      </button>
    </form>
  );
}
