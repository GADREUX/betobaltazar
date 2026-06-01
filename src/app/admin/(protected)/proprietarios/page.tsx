import { createClient } from '@/lib/supabase/server';
import { fmtPhone } from '@/lib/utils';
import Link from 'next/link';
import { Plus, Users, Phone, Mail, Edit2, Building2 } from 'lucide-react';
import OwnersActions from './owners-actions';

export const dynamic = 'force-dynamic';

export default async function ProprietariosPage() {
  const supabase = createClient();
  const { data: owners } = await supabase
    .from('owners')
    .select('*, properties(id, title, status)')
    .order('name');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs tracking-widest text-terra uppercase font-semibold mb-1">Cadastros</p>
          <h2 className="font-display text-2xl font-bold text-ink">Proprietários</h2>
          <p className="text-sm text-ink-soft/60 mt-0.5">{owners?.length || 0} proprietário(s) cadastrado(s)</p>
        </div>
        <Link href="/admin/proprietarios/novo" className="btn-primary">
          <Plus size={16} /> Novo Proprietário
        </Link>
      </div>

      {!owners?.length ? (
        <div className="card-base p-16 text-center">
          <Users size={40} className="text-ink-soft/30 mx-auto mb-3" />
          <h3 className="font-display text-lg font-semibold text-ink mb-1">Nenhum proprietário</h3>
          <p className="text-sm text-ink-soft/60 mb-6">Cadastre os proprietários dos imóveis da sua carteira.</p>
          <Link href="/admin/proprietarios/novo" className="btn-primary"><Plus size={16} /> Cadastrar primeiro</Link>
        </div>
      ) : (
        <div className="card-base overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-cream border-b border-border">
                  {['Nome','Contato','Imóveis','Ações'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-[10px] tracking-widest text-ink-soft/60 uppercase font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {owners.map((owner: any) => (
                  <tr key={owner.id} className="hover:bg-cream/30 transition">
                    <td className="px-5 py-4">
                      <div className="font-medium text-ink">{owner.name}</div>
                      {owner.cpf && <div className="text-xs text-ink-soft/60 mt-0.5">CPF: {owner.cpf}</div>}
                    </td>
                    <td className="px-5 py-4">
                      <div className="space-y-1">
                        {owner.phone && <a href={`tel:${owner.phone}`} className="flex items-center gap-1.5 text-xs text-ink-soft hover:text-terra transition"><Phone size={12} /> {fmtPhone(owner.phone)}</a>}
                        {owner.email && <a href={`mailto:${owner.email}`} className="flex items-center gap-1.5 text-xs text-ink-soft hover:text-terra transition"><Mail size={12} /> {owner.email}</a>}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {owner.properties?.length > 0 ? (
                        <div className="space-y-1">
                          {owner.properties.slice(0,2).map((p: any) => (
                            <div key={p.id} className="flex items-center gap-1.5 text-xs">
                              <Building2 size={11} className="text-terra shrink-0" />
                              <span className="text-ink-soft truncate max-w-[180px]">{p.title}</span>
                            </div>
                          ))}
                          {owner.properties.length > 2 && <span className="text-xs text-ink-soft/50">+{owner.properties.length - 2} mais</span>}
                        </div>
                      ) : <span className="text-xs text-ink-soft/40">Nenhum imóvel</span>}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <Link href={`/admin/proprietarios/${owner.id}/editar`} className="p-2 hover:bg-cream rounded-md text-ink-soft hover:text-terra transition" title="Editar"><Edit2 size={15} /></Link>
                        <OwnersActions id={owner.id} name={owner.name} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
