'use client';
import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function CopyDescButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <button onClick={copy} className={`mt-3 btn-sm w-full flex items-center justify-center gap-2 rounded-lg border transition ${copied ? 'bg-green text-white border-green' : 'bg-white border-border text-ink hover:border-terra'}`}>
      {copied ? <><Check size={13} /> Copiado!</> : <><Copy size={13} /> Copiar descrição</>}
    </button>
  );
}
