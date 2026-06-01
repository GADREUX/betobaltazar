import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import LeadForm from '../lead-form';
export default async function EditLeadPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const [{ data: lead }, { data: properties }] = await Promise.all([
    supabase.from('leads').select('*').eq('id', params.id).single(),
    supabase.from('properties').select('id, title').order('title'),
  ]);
  if (!lead) notFound();
  return (
    <div>
      <div className="mb-6">
        <p className="text-xs tracking-widest text-terra uppercase font-semibold mb-1">Editar lead</p>
        <h2 className="font-display text-3xl font-bold text-ink">{lead.name}</h2>
      </div>
      <LeadForm initial={lead} properties={properties || []} />
    </div>
  );
}
