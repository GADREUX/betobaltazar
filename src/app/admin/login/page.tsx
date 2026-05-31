'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Loader2, Lock, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  async function onLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { toast.error('Email ou senha incorretos'); setLoading(false); return; }
    toast.success('Bem-vindo!');
    router.push('/admin');
    router.refresh();
  }
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-terra rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg viewBox="0 0 40 40" className="w-9 h-9 text-white" fill="currentColor"><path d="M4 22 L20 6 L36 22 L36 36 L26 36 L26 26 L14 26 L14 36 L4 36 Z" /></svg>
          </div>
          <div className="font-display text-2xl font-bold text-ink">Beto Baltazar</div>
          <p className="text-xs tracking-[3px] text-terra uppercase font-semibold mt-1">Painel do Corretor</p>
        </div>
        <form onSubmit={onLogin} className="card-base p-8 space-y-5">
          <h1 className="font-display text-2xl font-bold text-ink">Entrar na conta</h1>
          <div><label className="field-label">E-mail</label><div className="relative"><Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="field-input pl-10" placeholder="seu@email.com" /></div></div>
          <div><label className="field-label">Senha</label><div className="relative"><Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="field-input pl-10" placeholder="••••••••" /></div></div>
          <button type="submit" disabled={loading} className="btn-primary w-full justify-center">{loading ? <><Loader2 size={16} className="animate-spin" /> Entrando...</> : 'Entrar'}</button>
          <p className="text-xs text-center text-ink-soft/50 pt-2 border-t border-border">Acesso exclusivo do gestor</p>
        </form>
      </div>
    </div>
  );
}
