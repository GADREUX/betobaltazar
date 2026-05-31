import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import TenantForm from '../../tenant-form';
export default async function EditTenantPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: tenant } = await supabase.from('tenants').select('*').eq('id', params.id).single();
  if (!tenant) notFound();
  return (
    <div>
      <div className="mb-6">
        <p className="text-xs tracking-widest text-terra uppercase font-semibold mb-1">Editar</p>
        <h2 className="font-display text-3xl font-bold text-ink">{tenant.name}</h2>
      </div>
      <TenantForm initial={tenant} />
    </div>
  );
}
