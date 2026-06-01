import { createClient } from '@/lib/supabase/server';
import { fmtPhone } from '@/lib/utils';
import Link from 'next/link';
import { Plus, Users, Phone, Mail, Edit2, Building2 } from 'lucide-react';
import TenantsActions from './tenants-actions';

export const dynamic = 'force-dynamic';

export default async function InquilinosPage() {
  const supabase = createClient();
  const { data: tenants } = await supabase
    .from('tenants')
    .select('*, contracts(id, status, properties(title))')
    .order('name');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs tracking-widest text-terra uppercase font-semibold mb-1">Cadastros</p>
          <h2 className="font-display text-2xl font-bold text-ink">Clientes</h2>
          <p className="text-sm text-ink-soft/60 mt-0.5">{tenants?.length || 0} cliente(s) cadastrado(s)</p>
        </div>
        <Link href="/admin/inquilinos/novo" className="btn-primary">
          <Plus size={16} /> Novo Cliente
        </Link>
      </div>

      {!tenants?.length ? (
        <div className="card-base p-16 text-center">
          <Users size={40} className="text-ink-soft/30 mx-auto mb-3" />
          <h3 className="font-display text-lg font-semibold text-ink mb-1">Nenhum cliente</h3>
          <p className="text-sm text-ink-soft/60 mb-6">Cadastre clientes e compradores interessados.</p>
          <Link href="/admin/inquilinos/novo" className="btn-primary"><Plus size={16} /> Cadastrar primeiro</Link>
        </div>
      ) : (
        <div className="card-base overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-cream border-b border-border">
                  {['Nome','Contato','Contrato','Ações'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-[10px] tracking-widest text-ink-soft/60 uppercase font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {tenants.map((tenant: any) => {
                  const activeContract = tenant.contracts?.find((c: any) => c.status === 'Ativo');
                  return (
                    <tr key={tenant.id} className="hover:bg-cream/30 transition">
                      <td className="px-5 py-4">
                        <div className="font-medium text-ink">{tenant.name}</div>
                        {tenant.cpf && <div className="text-xs text-ink-soft/60 mt-0.5">CPF: {tenant.cpf}</div>}
                      </td>
                      <td className="px-5 py-4">
                        <div className="space-y-1">
                          {tenant.phone && <a href={`tel:${tenant.phone}`} className="flex items-center gap-1.5 text-xs text-ink-soft hover:text-terra transition"><Phone size={12} /> {fmtPhone(tenant.phone)}</a>}
                          {tenant.email && <a href={`mailto:${tenant.email}`} className="flex items-center gap-1.5 text-xs text-ink-soft hover:text-terra transition"><Mail size={12} /> {tenant.email}</a>}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        {activeContract ? (
                          <div className="flex items-center gap-1.5 text-xs">
                            <Building2 size={11} className="text-terra shrink-0" />
                            <span className="text-ink-soft truncate max-w-[180px]">{activeContract.properties?.title}</span>
                            <span className="badge bg-green/10 text-green ml-1">Ativo</span>
                          </div>
                        ) : <span className="text-xs text-ink-soft/40">Sem contrato ativo</span>}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1">
                          <Link href={`/admin/inquilinos/${tenant.id}/editar`} className="p-2 hover:bg-cream rounded-md text-ink-soft hover:text-terra transition"><Edit2 size={15} /></Link>
                          <TenantsActions id={tenant.id} name={tenant.name} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
