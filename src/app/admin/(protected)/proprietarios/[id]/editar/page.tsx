import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { decryptSensitiveFields, SENSITIVE_FIELDS } from '@/lib/crypto';
import OwnerForm from '../../owner-form';

export default async function EditOwnerPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: owner } = await supabase.from('owners').select('*').eq('id', params.id).single();
  if (!owner) notFound();

  // Descriptografa campos sensíveis antes de exibir
  const decrypted = await decryptSensitiveFields(owner, SENSITIVE_FIELDS.owners);

  return (
    <div>
      <div className="mb-6">
        <p className="text-xs tracking-widest text-terra uppercase font-semibold mb-1">Editar</p>
        <h2 className="font-display text-3xl font-bold text-ink">{owner.name}</h2>
      </div>
      <OwnerForm initial={decrypted} />
    </div>
  );
}
