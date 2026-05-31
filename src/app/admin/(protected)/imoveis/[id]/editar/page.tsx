import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import PropertyForm from '@/components/property-form';
export default async function EditPropertyPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const [{ data: property }, { data: owners }] = await Promise.all([
    supabase.from('properties').select('*').eq('id', params.id).single(),
    supabase.from('owners').select('*').order('name'),
  ]);
  if (!property) notFound();
  return <div><div className="mb-6"><p className="text-xs tracking-widest text-terra uppercase font-semibold mb-1">Editar</p><h2 className="font-display text-3xl font-bold text-ink">{property.title}</h2></div><PropertyForm initial={property} owners={owners || []} /></div>;
}
