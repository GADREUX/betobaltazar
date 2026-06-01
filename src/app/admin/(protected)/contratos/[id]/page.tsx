import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { money, fmtDate } from '@/lib/utils';
import Link from 'next/link';
import { ArrowLeft, Edit2, Printer } from 'lucide-react';
import PrintButton from './print-button';

export const dynamic = 'force-dynamic';

export default async function ContractDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: c } = await supabase
    .from('contracts')
    .select('*, properties(*, owners(name)), owners(name, cpf, rg, address), tenants(name, cpf, rg, address, phone, email)')
    .eq('id', params.id)
    .single();

  if (!c) notFound();

  return (
    <div className="max-w-4xl space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <Link href="/admin/contratos" className="text-sm text-ink-soft hover:text-terra flex items-center gap-1.5"><ArrowLeft size={14} /> Voltar</Link>
        <div className="flex gap-2">
          <PrintButton />
          <Link href={`/admin/contratos/${c.id}/editar`} className="btn-outline"><Edit2 size={14} /> Editar</Link>
        </div>
      </div>

      {/* Contrato imprimível */}
      <div id="contrato-pdf" className="card-base p-10 space-y-8 print:shadow-none print:border-none">
        {/* Cabeçalho */}
        <div className="text-center border-b border-border pb-8">
          <h1 className="font-display text-3xl font-bold text-ink mb-1">CONTRATO DE {c.contract_type?.toUpperCase()}</h1>
          <p className="text-sm text-ink-soft/70">Celebrado em {fmtDate(c.start_date)}</p>
        </div>

        {/* Qualificação das partes */}
        <div className="space-y-6">
          <h2 className="font-display text-lg font-semibold text-ink border-b border-border pb-2">PARTES</h2>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-cream/40 rounded-xl p-5">
              <p className="text-xs tracking-widest text-terra uppercase font-semibold mb-3">Locador (Proprietário)</p>
              <p className="font-semibold text-ink">{c.owners?.name || '—'}</p>
              {c.owners?.cpf && <p className="text-sm text-ink-soft mt-1">CPF: {c.owners.cpf}</p>}
              {c.owners?.rg && <p className="text-sm text-ink-soft">RG: {c.owners.rg}</p>}
              {c.owners?.address && <p className="text-sm text-ink-soft mt-1">{c.owners.address}</p>}
            </div>
            <div className="bg-cream/40 rounded-xl p-5">
              <p className="text-xs tracking-widest text-terra uppercase font-semibold mb-3">Locatário (Inquilino)</p>
              <p className="font-semibold text-ink">{c.tenants?.name || '—'}</p>
              {c.tenants?.cpf && <p className="text-sm text-ink-soft mt-1">CPF: {c.tenants.cpf}</p>}
              {c.tenants?.rg && <p className="text-sm text-ink-soft">RG: {c.tenants.rg}</p>}
              {c.tenants?.address && <p className="text-sm text-ink-soft mt-1">{c.tenants.address}</p>}
              {c.tenants?.phone && <p className="text-sm text-ink-soft">Tel: {c.tenants.phone}</p>}
            </div>
          </div>
        </div>

        {/* Imóvel */}
        <div className="space-y-3">
          <h2 className="font-display text-lg font-semibold text-ink border-b border-border pb-2">IMÓVEL LOCADO</h2>
          <p className="text-ink">{c.properties?.title}</p>
          <p className="text-sm text-ink-soft">{c.properties?.address}, {c.properties?.neighborhood} — {c.properties?.city}/{c.properties?.state}</p>
        </div>

        {/* Condições */}
        <div className="space-y-3">
          <h2 className="font-display text-lg font-semibold text-ink border-b border-border pb-2">CONDIÇÕES</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { l: 'Valor do aluguel', v: `${money(c.rent_value)}/mês` },
              { l: 'Depósito caução', v: money(c.deposit) },
              { l: 'Vencimento', v: `Todo dia ${c.payment_day}` },
              { l: 'Reajuste anual', v: c.readjustment_index },
              { l: 'Início do contrato', v: fmtDate(c.start_date) },
              { l: 'Término do contrato', v: fmtDate(c.end_date) },
            ].map(item => (
              <div key={item.l} className="flex justify-between py-2 border-b border-border/50">
                <span className="text-sm text-ink-soft">{item.l}</span>
                <span className="text-sm font-medium text-ink">{item.v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Cláusulas padrão */}
        <div className="space-y-4">
          <h2 className="font-display text-lg font-semibold text-ink border-b border-border pb-2">CLÁUSULAS</h2>
          <div className="space-y-3 text-sm text-ink-soft leading-relaxed">
            <p><strong className="text-ink">1.</strong> O locatário obriga-se a pagar o aluguel até o dia {c.payment_day} de cada mês, sob pena de multa de 10% e juros de 1% ao mês após o vencimento.</p>
            <p><strong className="text-ink">2.</strong> O depósito caução de {money(c.deposit)} será devolvido ao término do contrato, descontadas eventuais reparações necessárias.</p>
            <p><strong className="text-ink">3.</strong> O aluguel será reajustado anualmente pelo índice {c.readjustment_index}, acumulado nos 12 meses anteriores.</p>
            <p><strong className="text-ink">4.</strong> É vedada a sublocação total ou parcial do imóvel sem autorização expressa do locador.</p>
            <p><strong className="text-ink">5.</strong> O locatário deverá conservar o imóvel em bom estado, realizando pequenos reparos de uso cotidiano.</p>
            <p><strong className="text-ink">6.</strong> Ao término do contrato, o imóvel deverá ser devolvido nas mesmas condições em que foi entregue, conforme laudo de vistoria.</p>
            {c.clauses && (
              <>
                <p><strong className="text-ink">7. Cláusulas adicionais:</strong></p>
                <p className="pl-4 whitespace-pre-line">{c.clauses}</p>
              </>
            )}
          </div>
        </div>

        {/* Assinaturas */}
        <div className="pt-8 space-y-3">
          <h2 className="font-display text-lg font-semibold text-ink border-b border-border pb-2">ASSINATURAS</h2>
          <p className="text-sm text-ink-soft text-center">Capão Bonito/SP, {fmtDate(c.start_date)}</p>
          <div className="grid sm:grid-cols-3 gap-8 mt-10">
            <div className="text-center">
              <div className="border-t border-ink mt-12 pt-2">
                <p className="text-sm font-medium text-ink">{c.owners?.name || 'Locador'}</p>
                <p className="text-xs text-ink-soft">Locador / Proprietário</p>
              </div>
            </div>
            <div className="text-center">
              <div className="border-t border-ink mt-12 pt-2">
                <p className="text-sm font-medium text-ink">{c.tenants?.name || 'Locatário'}</p>
                <p className="text-xs text-ink-soft">Locatário / Inquilino</p>
              </div>
            </div>
            <div className="text-center">
              <div className="border-t border-ink mt-12 pt-2">
                <p className="text-sm font-medium text-ink">Beto Baltazar</p>
                <p className="text-xs text-ink-soft">Corretor Intermediário · CRECI 318284-F</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
