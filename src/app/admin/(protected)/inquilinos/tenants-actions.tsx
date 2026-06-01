'use client';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function TenantsActions({ id, name }: { id: string; name: string }) {
  const router = useRouter();

  async function del() {
    if (!confirm(`Excluir "${name}"?\nOs contratos vinculados perderão o vínculo com este inquilino.`)) return;
    const supabase = createClient();
    const { error } = await supabase.from('tenants').delete().eq('id', id);
    if (error) { toast.error('Erro ao excluir: ' + error.message); return; }
      toast.success('Cliente excluído');
    router.refresh();
  }

  return (
    <button onClick={del} className="p-2 hover:bg-cream rounded-md text-ink-soft hover:text-red transition" title="Excluir">
      <Trash2 size={15} />
    </button>
  );
}
