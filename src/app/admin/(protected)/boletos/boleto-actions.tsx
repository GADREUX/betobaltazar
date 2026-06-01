'use client';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { CheckCircle2, MessageCircle, Trash2 } from 'lucide-react';
import { money, fmtDate } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function BoletoActions({ id, status, tenantName, tenantPhone, value, dueDate }: {
  id: string;
  status: string;
  tenantName?: string;
  tenantPhone?: string;
  value: number;
  dueDate: string;
}) {
  const router = useRouter();

  async function markAsPaid() {
    if (!confirm(`Marcar boleto de ${money(value)} como pago?`)) return;
    const supabase = createClient();
    const { error } = await supabase
      .from('boletos')
      .update({ status: 'Pago', paid_date: new Date().toISOString().split('T')[0] })
      .eq('id', id);
    if (error) { toast.error('Erro ao atualizar'); return; }
    toast.success('Boleto marcado como pago!');
    router.refresh();
  }

  function sendReminder() {
    if (!tenantPhone) { toast.error('Inquilino sem telefone cadastrado'); return; }
    const phone = tenantPhone.replace(/\D/g, '');
    const finalPhone = phone.startsWith('55') ? phone : `55${phone}`;
    const msg = `Olá ${tenantName?.split(' ')[0] || ''}! 🏠\n\nLembrete do seu aluguel:\n💰 Valor: ${money(value)}\n📅 Vencimento: ${fmtDate(dueDate)}\n\nQualquer dúvida, estou à disposição!\n\n— Beto Baltazar\nCRECI 318284-F`;
    window.open(`https://wa.me/${finalPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  }

  async function del() {
    if (!confirm('Excluir este boleto?')) return;
    const supabase = createClient();
    const { error } = await supabase.from('boletos').delete().eq('id', id);
    if (error) { toast.error('Erro ao excluir'); return; }
    toast.success('Boleto excluído');
    router.refresh();
  }

  return (
    <>
      {status === 'Pendente' && (
        <>
          <button onClick={markAsPaid} className="p-2 hover:bg-cream rounded-md text-ink-soft hover:text-green transition" title="Marcar como pago">
            <CheckCircle2 size={15} />
          </button>
          <button onClick={sendReminder} className="p-2 hover:bg-cream rounded-md text-ink-soft hover:text-green transition" title="Lembrar via WhatsApp">
            <MessageCircle size={15} />
          </button>
        </>
      )}
      <button onClick={del} className="p-2 hover:bg-cream rounded-md text-ink-soft hover:text-red transition" title="Excluir">
        <Trash2 size={15} />
      </button>
    </>
  );
}
