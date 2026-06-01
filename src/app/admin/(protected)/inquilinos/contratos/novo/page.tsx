import { createClient } from '@/lib/supabase/server';
import ContractForm from '../contract-form';
export default async function NovoContratoPage() {
  const supabase = createClient();
  const [{ data: properties }, { data: owners }, { data: tenants }] = await Promise.all([
    supabase.from('properties').select('id, title, city').eq('is_published', true).order('title'),
    supabase.from('owners').select('id, name').order('name'),
    supabase.from('tenants').select('id, name').order('name'),
  ]);
  return (
    <div>
      <div className="mb-6">
        <p className="text-xs tracking-widest text-terra uppercase font-semibold mb-1">Novo contrato</p>
        <h2 className="font-display text-3xl font-bold text-ink">Cadastrar contrato de locação</h2>
      </div>
      <ContractForm properties={properties || []} owners={owners || []} tenants={tenants || []} />
    </div>
  );
}
