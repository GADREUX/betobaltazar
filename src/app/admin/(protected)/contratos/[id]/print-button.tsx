'use client';
import { Printer } from 'lucide-react';

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="btn-secondary"
    >
      <Printer size={14} /> Imprimir / Salvar PDF
    </button>
  );
}
