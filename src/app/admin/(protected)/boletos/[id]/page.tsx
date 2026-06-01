import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { money, fmtDate } from '@/lib/utils';
import { generateBoletoPixCode } from '@/lib/pix';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import PixDisplay from './pix-display';

export const dynamic = 'force-dynamic';

export default async function BoletoDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: b } = await supabase
    .from('boletos')
    .select('*, tenants(name, phone, email), properties(title, address, city), contracts(payment_day)')
    .eq('id', params.id)
    .single();

  if (!b) notFound();

  const pixCode = generateBoletoPixCode(b.id, b.value);

  return (
    <div className="max-w-2xl space-y-5">
      <div className="flex items-center justify-between">
        <Link href="/admin/boletos" className="text-sm text-ink-soft hover:text-terra flex items-center gap-1.5"><ArrowLeft size={14} /> Voltar</Link>
        <span className={`badge ${
          b.status === 'Pago' ? 'bg-green/10 text-green' :
          b.status === 'Pendente' ? 'bg-yellow/10 text-yellow' : 'bg-ink/10 text-ink-soft'
        } px-3 py-1`}>{b.status}</span>
      </div>

      {/* Info do boleto */}
      <div className="card-base p-6">
        <h2 className="font-display text-2xl font-bold text-ink mb-5">Cobrança PIX</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { l: 'Inquilino', v: b.tenants?.name },
            { l: 'Imóvel', v: b.properties?.title },
            { l: 'Valor', v: money(b.value) },
            { l: 'Vencimento', v: fmtDate(b.due_date) },
            { l: 'Endereço', v: b.properties?.address },
            { l: 'Referência', v: `Aluguel ${fmtDate(b.due_date).slice(3)}` },
          ].map(item => (
            <div key={item.l}>
              <p className="text-xs text-ink-soft/60 mb-0.5">{item.l}</p>
              <p className="text-sm font-medium text-ink">{item.v || '—'}</p>
            </div>
          ))}
        </div>
        {b.paid_date && (
          <div className="mt-5 pt-5 border-t border-border flex items-center gap-2 text-green text-sm font-medium">
            ✓ Pago em {fmtDate(b.paid_date)}
          </div>
        )}
        {b.notes && (
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs text-ink-soft/60 mb-1">Observações</p>
            <p className="text-sm text-ink">{b.notes}</p>
          </div>
        )}
      </div>

      {/* PIX */}
      {b.status === 'Pendente' && (
        <PixDisplay pixCode={pixCode} value={b.value} tenantName={b.tenants?.name} tenantPhone={b.tenants?.phone} dueDate={b.due_date} />
      )}
    </div>
  );
}
