import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import VistoriaEditForm from './edit-form';
export default async function EditVistoriaPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const [{ data: inspection }, { data: properties }, { data: tenants }] = await Promise.all([
    supabase.from('inspections').select('*').eq('id', params.id).single(),
    supabase.from('properties').select('id, title, city').order('title'),
    supabase.from('tenants').select('id, name').order('name'),
  ]);
  if (!inspection) notFound();
  return (
    <div>
      <div className="mb-6">
        <p className="text-xs tracking-widest text-terra uppercase font-semibold mb-1">Editar vistoria</p>
        <h2 className="font-display text-3xl font-bold text-ink">Laudo de Vistoria</h2>
      </div>
      <VistoriaEditForm initial={inspection} properties={properties || []} tenants={tenants || []} />
    </div>
  );
}
