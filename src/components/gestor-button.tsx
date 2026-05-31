'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { KeyRound } from 'lucide-react';

export default function GestorButton() {
  const pathname = usePathname();
  if (pathname.startsWith('/admin')) return null;
  return (
    <Link href="/admin/login" className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-ink text-white text-xs font-medium px-4 py-2.5 rounded-full shadow-lift hover:bg-terra transition-all duration-200 border border-white/10 group">
      <KeyRound size={13} className="opacity-70 group-hover:opacity-100" />
      Área do Gestor
    </Link>
  );
}
