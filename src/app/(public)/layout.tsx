import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import GestorButton from '@/components/gestor-button';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <GestorButton />
      <div className="bg-ink text-white text-xs py-2.5 hidden md:block">
        <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
          <div className="flex gap-6 opacity-90">
            <a href="tel:+5515996897738" className="flex items-center gap-1.5 hover:text-terra transition"><Phone size={12} /> (15) 99689-7738</a>
            <a href="mailto:betobaltazar@gmail.com" className="flex items-center gap-1.5 hover:text-terra transition"><Mail size={12} /> betobaltazar@gmail.com</a>
            <span className="flex items-center gap-1.5"><MapPin size={12} /> Capão Bonito - SP</span>
          </div>
          <span className="text-terra/90 tracking-widest text-[10px] font-semibold">CRECI 318284-F</span>
        </div>
      </div>

      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-border shadow-soft">
        <div className="max-w-7xl mx-auto px-6 md:px-8 h-[68px] flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo-clean.png"
              alt="Beto Baltazar — Corretor de Imóveis"
              width={640}
              height={200}
              className="h-11 md:h-12 w-auto object-contain"
              priority
            />
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {[
              { href: '/', label: 'Início' },
              { href: '/imoveis', label: 'Imóveis' },
              { href: '/anuncie', label: 'Anuncie' },
              { href: '/sobre', label: 'Sobre' },
              { href: '/contato', label: 'Contato' },
            ].map((item) => (
              <Link key={item.href} href={item.href} className="text-sm font-medium text-ink hover:text-terra transition-colors">
                {item.label}
              </Link>
            ))}
          </nav>

          <a href="https://wa.me/5515996897738" target="_blank" rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-2 bg-terra hover:bg-terra-dark text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all">
            <MessageCircle size={16} /> Falar agora
          </a>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-ink text-white/80">
        <div className="spfc-bar" />
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="grid md:grid-cols-3 gap-10 mb-10">
            <div>
              <div className="bg-white rounded-xl p-4 inline-block mb-4">
                <Image
                  src="/logo-clean.png"
                  alt="Beto Baltazar — Corretor de Imóveis"
                  width={640}
                  height={200}
                  className="h-16 w-auto object-contain"
                />
              </div>
              <p className="text-sm text-white/60 leading-relaxed">Compra, venda e locação de imóveis em Capão Bonito com transparência e dedicação.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Navegação</h4>
              <ul className="space-y-2 text-sm">
                {['/', '/imoveis', '/anuncie', '/sobre', '/contato'].map((href, i) => (
                  <li key={href}><Link href={href} className="hover:text-terra transition">{['Início','Imóveis','Anuncie','Sobre','Contato'][i]}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Contato</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="tel:+5515996897738" className="hover:text-terra transition">(15) 99689-7738</a></li>
                <li><a href="mailto:betobaltazar@gmail.com" className="hover:text-terra transition break-all">betobaltazar@gmail.com</a></li>
                <li className="text-white/60">Rua Bernardino de Campos, 736<br/>Centro — Capão Bonito/SP</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/40">
            <p>© {new Date().getFullYear()} Beto Baltazar Corretor. Todos os direitos reservados.</p>
            <p>CRECI 318284-F</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
