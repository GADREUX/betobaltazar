'use client';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function VistoriaActions({ id }: { id: string }) {
  const router = useRouter();
  async function del() {
    if (!confirm('Excluir esta vistoria e todos os itens do laudo?')) return;
    const supabase = createClient();
    const { error } = await supabase.from('inspections').delete().eq('id', id);
    if (error) { toast.error('Erro ao excluir'); return; }
    toast.success('Vistoria excluída');
    router.refresh();
  }
  return (
    <button onClick={del} className="p-2 hover:bg-cream rounded-md text-ink-soft hover:text-red transition" title="Excluir">
      <Trash2 size={15} />
    </button>
  );
}
