import { createClient } from '@/lib/supabase/server';
import LeadForm from '../lead-form';
export default async function NovoLeadPage() {
  const supabase = createClient();
  const { data: properties } = await supabase.from('properties').select('id, title').order('title');
  return (
    <div>
      <div className="mb-6">
        <p className="text-xs tracking-widest text-terra uppercase font-semibold mb-1">Novo lead</p>
        <h2 className="font-display text-3xl font-bold text-ink">Cadastrar lead</h2>
      </div>
      <LeadForm properties={properties || []} />
    </div>
  );
}
