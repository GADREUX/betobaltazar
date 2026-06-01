import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import ContractForm from '../../contract-form';
export default async function EditContractPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const [{ data: contract }, { data: properties }, { data: owners }, { data: tenants }] = await Promise.all([
    supabase.from('contracts').select('*').eq('id', params.id).single(),
    supabase.from('properties').select('id, title, city').order('title'),
    supabase.from('owners').select('id, name').order('name'),
    supabase.from('tenants').select('id, name').order('name'),
  ]);
  if (!contract) notFound();
  return (
    <div>
      <div className="mb-6">
        <p className="text-xs tracking-widest text-terra uppercase font-semibold mb-1">Editar contrato</p>
        <h2 className="font-display text-3xl font-bold text-ink">Contrato de Locação</h2>
      </div>
      <ContractForm initial={contract} properties={properties || []} owners={owners || []} tenants={tenants || []} />
    </div>
  );
}
