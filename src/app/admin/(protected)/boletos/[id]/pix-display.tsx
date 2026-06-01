'use client';
import { useState, useEffect } from 'react';
import { Copy, CheckCircle2, MessageCircle } from 'lucide-react';
import { money, fmtDate } from '@/lib/utils';
import toast from 'react-hot-toast';

interface PixDisplayProps {
  pixCode: string;
  value: number;
  tenantName?: string;
  tenantPhone?: string;
  dueDate: string;
}

export default function PixDisplay({ pixCode, value, tenantName, tenantPhone, dueDate }: PixDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [qrUrl, setQrUrl] = useState('');

  useEffect(() => {
    // Gera QR Code via API gratuita
    const encoded = encodeURIComponent(pixCode);
    setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encoded}`);
  }, [pixCode]);

  function copy() {
    navigator.clipboard.writeText(pixCode);
    setCopied(true);
    toast.success('Código PIX copiado!');
    setTimeout(() => setCopied(false), 3000);
  }

  function sendWhatsApp() {
    if (!tenantPhone) { toast.error('Sem telefone cadastrado'); return; }
    const phone = tenantPhone.replace(/\D/g, '');
    const final = phone.startsWith('55') ? phone : `55${phone}`;
    const msg = `Olá ${tenantName?.split(' ')[0] || ''}! 🏠\n\nLembrete do seu aluguel:\n💰 Valor: ${money(value)}\n📅 Vencimento: ${fmtDate(dueDate)}\n\n*PIX Copia e Cola:*\n${pixCode}\n\nOu pela chave PIX:\n📧 ${process.env.NEXT_PUBLIC_PIX_KEY || 'betobaltazar@gmail.com'}\n\nApós o pagamento, envie o comprovante.\n\n— Beto Baltazar · CRECI 318284-F`;
    window.open(`https://wa.me/${final}?text=${encodeURIComponent(msg)}`, '_blank');
  }

  return (
    <div className="card-base p-6 space-y-6">
      <div>
        <p className="text-xs tracking-widest text-terra uppercase font-semibold mb-1">Pagamento via PIX</p>
        <h3 className="font-display text-xl font-bold text-ink">QR Code e Copia e Cola</h3>
      </div>

      <div className="flex flex-col sm:flex-row gap-8 items-center">
        {/* QR Code */}
        <div className="shrink-0">
          {qrUrl ? (
            <div className="p-3 bg-white border border-border rounded-2xl shadow-soft">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrUrl} alt="QR Code PIX" width={200} height={200} className="rounded-lg" />
            </div>
          ) : (
            <div className="w-[224px] h-[224px] bg-cream rounded-2xl flex items-center justify-center">
              <span className="text-xs text-ink-soft/60">Carregando QR...</span>
            </div>
          )}
          <p className="text-xs text-ink-soft/60 text-center mt-2">Escaneie com o app do banco</p>
        </div>

        {/* Info + Copia e Cola */}
        <div className="flex-1 space-y-4 w-full">
          <div className="bg-cream/50 rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-ink-soft/70">Valor</span>
              <span className="font-display font-bold text-ink text-lg">{money(value)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-ink-soft/70">Vencimento</span>
              <span className="font-medium text-ink">{fmtDate(dueDate)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-ink-soft/70">Favorecido</span>
              <span className="font-medium text-ink">Beto Baltazar</span>
            </div>
          </div>

          {/* Código copia e cola */}
          <div>
            <p className="text-xs text-ink-soft/60 mb-1.5">Código PIX (copia e cola)</p>
            <div className="flex gap-2">
              <div className="flex-1 bg-cream border border-border rounded-lg px-3 py-2 font-mono text-xs text-ink-soft overflow-hidden">
                <p className="truncate">{pixCode.slice(0, 50)}...</p>
              </div>
              <button onClick={copy} className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${copied ? 'bg-green text-white' : 'bg-terra text-white hover:bg-terra-dark'}`}>
                {copied ? <CheckCircle2 size={15} /> : <Copy size={15} />}
                {copied ? 'Copiado!' : 'Copiar'}
              </button>
            </div>
          </div>

          {/* WhatsApp */}
          <button onClick={sendWhatsApp} className="w-full btn-secondary flex items-center justify-center gap-2">
            <MessageCircle size={16} />
            Enviar cobrança via WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
