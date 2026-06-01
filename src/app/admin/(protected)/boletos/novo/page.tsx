import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import BoletoForm from './boleto-form';

export const dynamic = 'force-dynamic';

export default async function NovoBoletoPage() {
  const supabase = createClient();
  const [{ data: contracts }, { data: tenants }, { data: properties }] = await Promise.all([
    supabase.from('contracts').select('id, rent_value, payment_day, tenants(name), properties(title)').eq('status', 'Ativo'),
    supabase.from('tenants').select('id, name').order('name'),
    supabase.from('properties').select('id, title').order('title'),
  ]);

  return (
    <div>
      <div className="mb-6">
        <p className="text-xs tracking-widest text-terra uppercase font-semibold mb-1">Novo boleto</p>
        <h2 className="font-display text-3xl font-bold text-ink">Gerar cobrança PIX</h2>
      </div>
      <BoletoForm contracts={contracts || []} tenants={tenants || []} properties={properties || []} />
    </div>
  );
}
