import Link from 'next/link';
import { Sparkles, ArrowLeft, Check } from 'lucide-react';
interface ComingSoonProps { title: string; description: string; features?: string[]; }
export default function ComingSoon({ title, description, features }: ComingSoonProps) {
  return (
    <div className="max-w-3xl">
      <div className="card-base p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-terra/10 flex items-center justify-center">
          <Sparkles className="text-terra" size={28} strokeWidth={1.5} />
        </div>
        <p className="text-xs tracking-widest text-terra uppercase font-semibold mb-2">Em desenvolvimento · Fase 2</p>
        <h2 className="font-display text-3xl font-bold text-ink mb-3">{title}</h2>
        <p className="text-ink-soft/75 leading-relaxed max-w-xl mx-auto mb-8">{description}</p>
        {features && features.length > 0 && (
          <div className="bg-cream border border-border rounded-2xl p-6 text-left max-w-md mx-auto mb-8">
            <ul className="space-y-2">
              {features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-ink-soft">
                  <Check size={14} className="text-green shrink-0 mt-0.5" /><span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        <Link href="/admin" className="btn-outline"><ArrowLeft size={14} /> Voltar ao Dashboard</Link>
      </div>
    </div>
  );
}
