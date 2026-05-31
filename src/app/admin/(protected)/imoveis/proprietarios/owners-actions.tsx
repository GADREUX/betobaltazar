'use client';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function OwnersActions({ id, name }: { id: string; name: string }) {
  const router = useRouter();

  async function del() {
    if (!confirm(`Excluir "${name}"?\nOs imóveis vinculados perderão o vínculo com este proprietário.`)) return;
    const supabase = createClient();
    const { error } = await supabase.from('owners').delete().eq('id', id);
    if (error) { toast.error('Erro ao excluir: ' + error.message); return; }
    toast.success('Proprietário excluído');
    router.refresh();
  }

  return (
    <button onClick={del} className="p-2 hover:bg-cream rounded-md text-ink-soft hover:text-red transition" title="Excluir">
      <Trash2 size={15} />
    </button>
  );
}
