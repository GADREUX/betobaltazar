'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ExternalLink, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PortaisActions({ propertyId, portalName, listing, isActive, externalUrl }: {
  propertyId: string;
  portalName: string;
  listing?: any;
  isActive: boolean;
  externalUrl?: string;
}) {
  const [active, setActive] = useState(isActive);
  const [url, setUrl] = useState(externalUrl || '');
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    const supabase = createClient();
    const newStatus = active ? 'Pausado' : 'Ativo';

    if (listing) {
      await supabase.from('portal_listings').update({ status: newStatus, last_sync_at: new Date().toISOString() }).eq('id', listing.id);
    } else {
      await supabase.from('portal_listings').insert({
        property_id: propertyId,
        portal_name: portalName,
        status: newStatus,
        external_url: url || null,
      });
    }

    setActive(!active);
    setLoading(false);
    toast.success(`${portalName}: ${newStatus}`);
  }

  async function saveUrl() {
    if (!listing) return;
    const supabase = createClient();
    await supabase.from('portal_listings').update({ external_url: url }).eq('id', listing.id);
    setEditing(false);
    toast.success('Link salvo!');
  }

  return (
    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition cursor-pointer ${
      active ? 'bg-green/10 border-green/30 text-green' : 'bg-cream border-border text-ink-soft/60 hover:border-terra/30'
    }`}>
      <button onClick={toggle} disabled={loading} className="flex items-center gap-1.5" title={`${active ? 'Pausar' : 'Ativar'} no ${portalName}`}>
        {active ? <Check size={11} /> : <X size={11} />}
        {portalName}
      </button>
      {active && url && (
        <a href={url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="hover:text-terra transition ml-1">
          <ExternalLink size={11} />
        </a>
      )}
      {active && !editing && (
        <button onClick={() => setEditing(true)} className="text-ink-soft/40 hover:text-terra transition ml-0.5 text-[10px]" title="Adicionar link">
          {url ? '✎' : '+link'}
        </button>
      )}
      {editing && (
        <div className="flex items-center gap-1 ml-1" onClick={e => e.stopPropagation()}>
          <input
            className="border border-border rounded px-1.5 py-0.5 text-[10px] w-40 text-ink"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="https://zap.com.br/..."
            autoFocus
          />
          <button onClick={saveUrl} className="text-green hover:text-green/80"><Check size={11} /></button>
          <button onClick={() => setEditing(false)} className="text-red hover:text-red/80"><X size={11} /></button>
        </div>
      )}
    </div>
  );
}
