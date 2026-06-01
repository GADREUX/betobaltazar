'use client';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Trash2, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContractActions({ id, tenantName, tenantPhone }: { id: string; tenantName?: string; tenantPhone?: string }) {
  const router = useRouter();

  async function del() {
    if (!confirm('Excluir este contrato?\nOs boletos vinculados também serão excluídos.')) return;
    const supabase = createClient();
    const { error } = await supabase.from('contracts').delete().eq('id', id);
    if (error) { toast.error('Erro ao excluir: ' + error.message); return; }
    toast.success('Contrato excluído');
    router.refresh();
  }

  function sendWhatsApp() {
    if (!tenantPhone) { toast.error('Inquilino sem telefone cadastrado'); return; }
    const phone = tenantPhone.replace(/\D/g, '');
    const finalPhone = phone.startsWith('55') ? phone : `55${phone}`;
    const msg = `Olá ${tenantName?.split(' ')[0] || ''}! Aqui é o Beto Baltazar. Gostaria de conversar sobre a renovação do seu contrato. Podemos agendar?`;
    window.open(`https://wa.me/${finalPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  }

  return (
    <>
      <button onClick={sendWhatsApp} className="p-2 hover:bg-cream rounded-md text-ink-soft hover:text-green transition" title="Lembrar renovação via WhatsApp">
        <MessageCircle size={15} />
      </button>
      <button onClick={del} className="p-2 hover:bg-cream rounded-md text-ink-soft hover:text-red transition" title="Excluir">
        <Trash2 size={15} />
      </button>
    </>
  );
}
