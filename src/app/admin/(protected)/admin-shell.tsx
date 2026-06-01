'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { LayoutDashboard, Building2, Users, FileSignature, Receipt, Target, Globe, ClipboardCheck, BarChart3, Inbox, LogOut, Menu } from 'lucide-react';
import toast from 'react-hot-toast';

const NAV = [
  { section: 'Visão Geral', items: [{ href: '/admin', icon: LayoutDashboard, label: 'Dashboard' }, { href: '/admin/submissoes', icon: Inbox, label: 'Solicitações' }] },
  { section: 'Cadastros', items: [{ href: '/admin/imoveis', icon: Building2, label: 'Imóveis' }, { href: '/admin/proprietarios', icon: Users, label: 'Proprietários' }, { href: '/admin/inquilinos', icon: Users, label: 'Clientes' }] },
  { section: 'Operação', items: [{ href: '/admin/contratos', icon: FileSignature, label: 'Contratos' }, { href: '/admin/boletos', icon: Receipt, label: 'Boletos PIX' }, { href: '/admin/vistorias', icon: ClipboardCheck, label: 'Vistorias' }] },
  { section: 'Comercial', items: [{ href: '/admin/crm', icon: Target, label: 'CRM / Funil' }, { href: '/admin/portais', icon: Globe, label: 'Portais' }, { href: '/admin/relatorios', icon: BarChart3, label: 'Relatórios' }] },
];

export default function AdminShell({ children, userEmail }: { children: React.ReactNode; userEmail: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    const supabase = createClient();
    await (supabase.auth as any).signOut();
    toast.success('Até logo!');
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-cream flex">
      <aside className={`fixed top-0 left-0 bottom-0 w-[250px] bg-ink text-white z-50 flex flex-col transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="px-5 py-5 border-b border-white/10 flex items-center gap-3">
          <div className="w-9 h-9 bg-terra rounded-lg flex items-center justify-center shrink-0">
            <svg viewBox="0 0 40 40" className="w-5 h-5 text-white" fill="currentColor"><path d="M4 22 L20 6 L36 22 L36 36 L26 36 L26 26 L14 26 L14 36 L4 36 Z" /></svg>
          </div>
          <div><div className="font-display font-bold text-white text-base leading-tight">Beto Baltazar</div><div className="text-[10px] text-terra tracking-widest uppercase font-semibold">Corretor</div></div>
        </div>
        <nav className="flex-1 overflow-y-auto py-3">
          {NAV.map(s => (
            <div key={s.section} className="mb-2">
              <div className="text-[10px] tracking-[2.5px] text-white/30 uppercase font-semibold px-5 mb-1 mt-3">{s.section}</div>
              {s.items.map(item => {
                const Icon = item.icon;
                const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                return (
                  <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 px-5 py-2.5 text-sm transition-all border-l-2 ${active ? 'bg-white/10 text-white border-terra font-medium' : 'text-white/50 border-transparent hover:bg-white/5 hover:text-white/80'}`}>
                    <Icon size={16} strokeWidth={1.7} />{item.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
        <div className="px-5 py-4 border-t border-white/10">
          <div className="text-xs text-white/40 mb-2 truncate">{userEmail}</div>
          <button onClick={logout} className="flex items-center gap-2 text-xs text-white/50 hover:text-white transition"><LogOut size={14} /> Sair</button>
        </div>
      </aside>
      {open && <button onClick={() => setOpen(false)} className="md:hidden fixed inset-0 bg-black/40 z-40" />}
      <div className="flex-1 md:ml-[250px] min-h-screen flex flex-col">
        <header className="h-16 bg-white border-b border-border sticky top-0 z-30 flex items-center px-6 justify-between">
          <div className="flex items-center gap-3">
            <button className="md:hidden text-ink-soft" onClick={() => setOpen(true)}><Menu size={22} /></button>
            <span className="font-display font-semibold text-ink">Painel do Corretor</span>
          </div>
          <Link href="/" target="_blank" className="text-xs text-terra hover:underline">Ver site →</Link>
        </header>
        <main className="flex-1 p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
