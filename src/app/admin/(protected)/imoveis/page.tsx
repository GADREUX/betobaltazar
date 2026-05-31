import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import { money } from '@/lib/utils';
import { Plus, Building2, AlertCircle, Eye, Edit2, Trash2, MessageCircle } from 'lucide-react';
export const dynamic = 'force-dynamic';
export default async function AdminPropertiesPage() {
  const supabase = createClient();
  const { data: properties, count } = await supabase.from('properties').select('*, owners(name)', { count: 'exact' }).order('created_at', { ascending: false });
  const total = count || 0;
  const remaining = Math.max(0, 50 - total);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <span className="font-display text-2xl font-bold text-ink">{total}</span>
          <span className="text-ink-soft/60"> / 50 imóveis</span>
          <p className="text-xs text-ink-soft/60 mt-0.5">{remaining > 0 ? `${remaining} vagas restantes` : 'Limite atingido'}</p>
        </div>
        {remaining > 0 ? (
          <Link href="/admin/imoveis/novo" className="btn-primary"><Plus size={16} /> Novo Imóvel</Link>
        ) : (
          <div className="badge bg-red/10 text-red py-2 px-3 flex items-center gap-1.5"><AlertCircle size={14} /> Limite atingido</div>
        )}
      </div>
      <div className="card-base overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-cream border-b border-border">{['Imóvel','Tipo','Valor','Status','Ações'].map(h => <th key={h} className="text-left px-5 py-3 text-[10px] tracking-widest text-ink-soft/60 uppercase font-semibold">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-border">
              {!properties?.length ? (
                <tr><td colSpan={5} className="text-center py-16 text-ink-soft/50">Nenhum imóvel cadastrado</td></tr>
              ) : properties.map((p: any) => {
                const isRent = p.purpose === 'Locação';
                const price = isRent && p.rent ? `${money(p.rent)}/mês` : money(p.price);
                const photo = p.photos?.[0];
                return (
                  <tr key={p.id} className="hover:bg-cream/30 transition">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-lg overflow-hidden bg-cream shrink-0 relative">
                          {photo ? <Image src={photo} alt={p.title} fill className="object-cover" sizes="56px" /> : <div className="flex items-center justify-center w-full h-full text-terra/40"><Building2 size={20} /></div>}
                        </div>
                        <div className="min-w-0"><div className="font-medium text-ink truncate max-w-[220px]">{p.title}</div><div className="text-xs text-ink-soft/60">{p.neighborhood} · {p.purpose}</div></div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-ink">{p.type}</td>
                    <td className="px-5 py-3.5 font-semibold text-ink">{price}</td>
                    <td className="px-5 py-3.5"><span className={`badge ${p.status === 'Disponível' ? 'bg-green/10 text-green' : p.status === 'Reservado' ? 'bg-yellow/10 text-yellow' : 'bg-ink/10 text-ink'}`}>{p.status}</span></td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1">
                        <Link href={`/imoveis/${p.id}`} target="_blank" className="p-2 hover:bg-cream rounded-md text-ink-soft hover:text-ink transition" title="Ver"><Eye size={15} /></Link>
                        <Link href={`/admin/imoveis/${p.id}/editar`} className="p-2 hover:bg-cream rounded-md text-ink-soft hover:text-terra transition" title="Editar"><Edit2 size={15} /></Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
