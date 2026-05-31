import { Phone, Mail, MapPin, MessageCircle, Clock } from 'lucide-react';
export const metadata = { title: 'Contato — Beto Baltazar Corretor' };
export default function ContatoPage() {
  return (
    <div className="bg-paper min-h-screen">
      <section className="bg-cream/40 border-b border-border"><div className="max-w-7xl mx-auto px-6 md:px-8 py-12"><p className="text-xs tracking-[4px] text-terra uppercase mb-3 font-semibold">Contato</p><h1 className="font-display text-4xl font-bold text-ink">Fale diretamente comigo.</h1></div></section>
      <div className="max-w-4xl mx-auto px-6 md:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-5">
          <a href="https://wa.me/5515996897738" target="_blank" rel="noopener noreferrer" className="group bg-terra hover:bg-terra-dark text-white rounded-2xl p-8 transition-all shadow-card hover:shadow-lift"><MessageCircle size={32} className="mb-4"/><h3 className="font-display text-2xl font-bold mb-2">WhatsApp</h3><p className="text-white/80 text-sm mb-3">A forma mais rápida.</p><p className="text-lg font-semibold">(15) 99689-7738</p></a>
          <a href="tel:+5515996897738" className="bg-white border border-border rounded-2xl p-8 hover:shadow-card transition-all"><Phone size={32} className="text-ink mb-4"/><h3 className="font-display text-2xl font-bold text-ink mb-2">Telefone</h3><p className="text-ink-soft/70 text-sm mb-3">Para uma conversa detalhada.</p><p className="text-lg font-semibold text-ink">(15) 99689-7738</p></a>
          <a href="mailto:betobaltazar@gmail.com" className="bg-white border border-border rounded-2xl p-8 hover:shadow-card transition-all"><Mail size={32} className="text-terra mb-4"/><h3 className="font-display text-2xl font-bold text-ink mb-2">E-mail</h3><p className="text-ink-soft/70 text-sm mb-3">Para documentos e propostas.</p><p className="text-base font-semibold text-ink break-all">betobaltazar@gmail.com</p></a>
          <div className="bg-white border border-border rounded-2xl p-8"><MapPin size={32} className="text-terra mb-4"/><h3 className="font-display text-2xl font-bold text-ink mb-2">Endereço</h3><p className="text-ink-soft/70 text-sm mb-3">Atendo com hora marcada.</p><p className="text-base font-semibold text-ink leading-relaxed">Rua Bernardino de Campos, 736<br/>Centro · Capão Bonito/SP</p></div>
        </div>
        <div className="card-base p-6 mt-5 flex items-start gap-4 bg-cream/40"><Clock size={22} className="text-terra shrink-0 mt-1"/><div><h3 className="font-semibold text-ink mb-2">Horário de atendimento</h3><p className="text-sm text-ink-soft/80"><strong>Seg–Sex:</strong> 8h às 19h · <strong>Sábado:</strong> 8h às 14h</p></div></div>
      </div>
    </div>
  );
}
