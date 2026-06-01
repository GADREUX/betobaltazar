import { createClient } from '@/lib/supabase/server';
import VistoriaWizard from '../vistoria-wizard';
export default async function NovaVistoriaPage() {
  const supabase = createClient();
  const [{ data: properties }, { data: tenants }] = await Promise.all([
    supabase.from('properties').select('id, title, city').order('title'),
    supabase.from('tenants').select('id, name').order('name'),
  ]);
  return (
    <div>
      <div className="mb-6">
        <p className="text-xs tracking-widest text-terra uppercase font-semibold mb-1">Nova vistoria</p>
        <h2 className="font-display text-3xl font-bold text-ink">Criar laudo de vistoria</h2>
      </div>
      <VistoriaWizard properties={properties || []} tenants={tenants || []} />
    </div>
  );
}
