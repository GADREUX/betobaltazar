'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Loader2, Lock, Mail, Award, MapPin, Building2 } from 'lucide-react';
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
    <div className="min-h-screen flex">
      {/* Lado esquerdo — branding + imagem */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-ink flex-col justify-between p-12 overflow-hidden">
        {/* Fundo com padrão de casas */}
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="houses" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                <path d="M10 50 L40 20 L70 50 L70 70 L50 70 L50 55 L30 55 L30 70 L10 70 Z" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#houses)" />
          </svg>
        </div>

        {/* Gradiente vermelho no canto */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-terra/30 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-terra/20 rounded-full blur-[80px] pointer-events-none" />

        {/* Logo */}
        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-terra rounded-xl flex items-center justify-center">
              <svg viewBox="0 0 40 40" className="w-7 h-7 text-white" fill="currentColor">
                <path d="M4 22 L20 6 L36 22 L36 36 L26 36 L26 26 L14 26 L14 36 L4 36 Z" />
              </svg>
            </div>
            <div>
              <div className="font-display text-2xl font-bold text-white leading-tight">Beto Baltazar</div>
              <div className="text-[10px] tracking-[3px] text-terra uppercase font-semibold">Corretor de Imóveis</div>
            </div>
          </div>
        </div>

        {/* Conteúdo central */}
        <div className="relative flex-1 flex flex-col justify-center">
          <h2 className="font-display text-4xl font-bold text-white leading-tight mb-4">
            Gerencie sua<br />
            <span className="text-terra">carteira de imóveis</span><br />
            com facilidade.
          </h2>
          <p className="text-white/60 text-lg leading-relaxed max-w-sm">
            Cadastre imóveis, acompanhe leads, gere boletos PIX e muito mais — tudo em um só lugar.
          </p>

          {/* Stats */}
          <div className="flex gap-6 mt-10">
            <div className="text-center">
              <div className="font-display text-3xl font-bold text-white">50</div>
              <div className="text-xs text-white/50 mt-1">Imóveis</div>
            </div>
            <div className="w-px bg-white/10" />
            <div className="text-center">
              <div className="font-display text-3xl font-bold text-white">PIX</div>
              <div className="text-xs text-white/50 mt-1">Cobranças</div>
            </div>
            <div className="w-px bg-white/10" />
            <div className="text-center">
              <div className="font-display text-3xl font-bold text-white">CRM</div>
              <div className="text-xs text-white/50 mt-1">Funil</div>
            </div>
          </div>
        </div>

        {/* Rodapé */}
        <div className="relative">
          <div className="flex items-center gap-6 text-white/40 text-xs">
            <span className="flex items-center gap-1.5"><Award size={13} /> CRECI 318284-F</span>
            <span className="flex items-center gap-1.5"><MapPin size={13} /> Capão Bonito/SP</span>
            <span className="flex items-center gap-1.5"><Building2 size={13} /> Desde 2019</span>
          </div>
        </div>
      </div>

      {/* Lado direito — formulário */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-cream">
        <div className="w-full max-w-md">
          {/* Logo mobile */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-10 h-10 bg-terra rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 40 40" className="w-6 h-6 text-white" fill="currentColor">
                <path d="M4 22 L20 6 L36 22 L36 36 L26 36 L26 26 L14 26 L14 36 L4 36 Z" />
              </svg>
            </div>
            <div>
              <div className="font-display text-xl font-bold text-ink">Beto Baltazar</div>
              <div className="text-[10px] tracking-[2px] text-terra uppercase font-semibold">Corretor de Imóveis</div>
            </div>
          </div>

          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-ink mb-2">Bem-vindo de volta</h1>
            <p className="text-ink-soft/70">Entre com suas credenciais para acessar o painel.</p>
          </div>

          <form onSubmit={onLogin} className="space-y-5">
            <div>
              <label className="field-label">E-mail</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="field-input pl-11"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div>
              <label className="field-label">Senha</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="field-input pl-11"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 text-base">
              {loading ? <><Loader2 size={18} className="animate-spin" /> Entrando...</> : 'Entrar no painel'}
            </button>
          </form>

          <p className="text-xs text-center text-ink-soft/40 mt-8">
            Acesso exclusivo do gestor · Beto Baltazar Corretor
          </p>
        </div>
      </div>
    </div>
  );
}
