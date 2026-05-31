import AnuncieForm from './anuncie-form';
export const metadata = { title: 'Anuncie seu Imóvel — Beto Baltazar Corretor' };
export default function AnunciePage() {
  return (
    <div className="bg-paper">
      <section className="bg-cream/40 border-b border-border"><div className="max-w-7xl mx-auto px-6 md:px-8 py-12 md:py-16"><p className="text-xs tracking-[4px] text-terra uppercase mb-3 font-semibold">Para proprietários</p><h1 className="font-display text-4xl md:text-5xl font-bold text-ink">Cadastre seu imóvel.</h1></div></section>
      <div className="max-w-3xl mx-auto px-6 md:px-8 py-16"><AnuncieForm /></div>
    </div>
  );
}
