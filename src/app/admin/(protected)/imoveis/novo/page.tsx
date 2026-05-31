import { createClient } from '@/lib/supabase/server';
import PropertyForm from '@/components/property-form';
export default async function NewPropertyPage() {
  const supabase = createClient();
  const { data: owners } = await supabase.from('owners').select('*').order('name');
  return <div><div className="mb-6"><p className="text-xs tracking-widest text-terra uppercase font-semibold mb-1">Novo cadastro</p><h2 className="font-display text-3xl font-bold text-ink">Cadastrar imóvel</h2></div><PropertyForm owners={owners || []} /></div>;
}
