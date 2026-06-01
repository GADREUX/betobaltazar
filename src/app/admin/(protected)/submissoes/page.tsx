import { createClient } from '@/lib/supabase/server';
import { fmtPhone, timeAgo } from '@/lib/utils';
import Link from 'next/link';
import { Inbox, Phone, MessageCircle, Check } from 'lucide-react';
import { revalidatePath } from 'next/cache';
export const dynamic = 'force-dynamic';

async function markAsRead(formData: FormData) {
  'use server';
  const id = formData.get('id') as string;
  const supabase = createClient();
  await supabase.from('submissions').update({ status: 'Lido' }).eq('id', id);
  revalidatePath('/admin/submissoes');
  revalidatePath('/admin');
}

export default async function SubmissionsPage() {
  const supabase = createClient();
  const { data: subs } = await supabase.from('submissions').select('*').order('created_at', { ascending: false });
  return (
    <div className="space-y-5">
      <div><p className="text-xs tracking-widest text-terra uppercase font-semibold mb-1">Inbox</p><h2 className="font-display text-2xl font-bold text-ink">Solicitações do site</h2></div>
      {!subs?.length ? (
        <div className="card-base p-16 text-center"><Inbox size={40} className="text-ink-soft/30 mx-auto mb-3" /><h3 className="font-display text-lg font-semibold text-ink mb-1">Nenhuma solicitação</h3><p className="text-sm text-ink-soft/60">Quando alguém preencher o formulário, aparecerá aqui.</p></div>
      ) : (
        <div className="space-y-3">
          {subs.map((s: any) => (
            <div key={s.id} className="card-base p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-medium text-ink">{s.name}</span>
                    {s.status === 'Novo' && <span className="badge bg-terra text-white">Novo</span>}
                    {s.status === 'Lido' && <span className="badge bg-cream text-ink-soft">Visto</span>}
                    {s.status === 'Convertido' && <span className="badge bg-green/10 text-green">Convertido</span>}
                  </div>
                  <div className="text-xs text-ink-soft/65 flex gap-3 flex-wrap">
                    <span>{s.property_type} · {s.purpose}</span>
                    <span>·</span><span>{fmtPhone(s.phone)}</span>
                    <span>·</span><span>{timeAgo(s.created_at)}</span>
                  </div>
                  {s.property_address && <p className="text-sm text-ink-soft mt-2">{s.property_address}</p>}
                  {s.property_details && <p className="text-xs text-ink-soft/70 mt-1 whitespace-pre-line">{s.property_details}</p>}
                </div>
                <div className="flex gap-2 shrink-0 flex-wrap">
                  {s.status === 'Novo' && (
                    <form action={markAsRead}>
                      <input type="hidden" name="id" value={s.id} />
                      <button type="submit" className="btn-outline btn-sm text-ink-soft hover:text-ink">
                        <Check size={13} /> Marcar como visto
                      </button>
                    </form>
                  )}
                  <a href={`https://wa.me/${s.phone.replace(/\D/g,'')}?text=${encodeURIComponent(`Olá ${s.name.split(' ')[0]}! Aqui é o Beto Baltazar, Corretor de Imóveis. Recebi seu cadastro e gostaria de conversar.`)}`} target="_blank" className="btn-primary btn-sm"><MessageCircle size={13} /> WhatsApp</a>
                  <a href={`tel:${s.phone}`} className="btn-outline btn-sm"><Phone size={13} /> Ligar</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
