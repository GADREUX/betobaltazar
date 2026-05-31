'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { Upload, X, Loader2, GripVertical } from 'lucide-react';
import toast from 'react-hot-toast';

interface PhotoUploaderProps {
  photos: string[];
  onChange: (photos: string[]) => void;
}

export default function PhotoUploader({ photos, onChange }: PhotoUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function uploadFiles(files: FileList | File[]) {
    const list = Array.from(files);
    if (photos.length + list.length > 20) {
      toast.error(`Máximo de 20 fotos. Você já tem ${photos.length}.`);
      return;
    }
    setUploading(true);
    const supabase = createClient();
    const uploaded: string[] = [];

    for (const file of list) {
      if (!file.type.startsWith('image/')) { toast.error(`${file.name} não é uma imagem`); continue; }
      if (file.size > 5 * 1024 * 1024) { toast.error(`${file.name} é maior que 5MB`); continue; }

      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const path = `properties/${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;

      const { error } = await supabase.storage.from('property-photos').upload(path, file, { cacheControl: '3600' });
      if (error) { toast.error(`Falha ao enviar ${file.name}`); continue; }

      const { data } = supabase.storage.from('property-photos').getPublicUrl(path);
      uploaded.push(data.publicUrl);
    }

    if (uploaded.length > 0) {
      onChange([...photos, ...uploaded]);
      toast.success(`${uploaded.length} foto(s) enviada(s)!`);
    }
    setUploading(false);
  }

  async function removePhoto(idx: number) {
    const url = photos[idx];
    onChange(photos.filter((_, i) => i !== idx));
    try {
      const supabase = createClient();
      const path = url.split('/property-photos/')[1];
      if (path) await supabase.storage.from('property-photos').remove([path]);
    } catch {}
  }

  function onDragStart(idx: number) { setDraggedIdx(idx); }
  function onDragOver(e: React.DragEvent, idx: number) {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === idx) return;
    const next = [...photos];
    const [moved] = next.splice(draggedIdx, 1);
    next.splice(idx, 0, moved);
    setDraggedIdx(idx);
    onChange(next);
  }
  function onDragEnd() { setDraggedIdx(null); }

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files.length) uploadFiles(e.dataTransfer.files); }}
        onClick={() => !uploading && inputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${dragOver ? 'border-terra bg-terra/5' : 'border-border hover:border-terra/50 hover:bg-cream/30'} ${uploading ? 'pointer-events-none opacity-60' : ''}`}
      >
        <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => e.target.files && uploadFiles(e.target.files)} />
        <div className="flex flex-col items-center gap-3">
          {uploading ? (
            <><Loader2 size={36} className="text-terra animate-spin" /><p className="text-sm font-medium text-ink">Enviando fotos...</p></>
          ) : (
            <>
              <div className="w-16 h-16 rounded-2xl bg-terra/10 flex items-center justify-center">
                <Upload size={28} className="text-terra" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-base font-semibold text-ink">Clique aqui ou arraste as fotos</p>
                <p className="text-sm text-ink-soft/60 mt-1">PNG, JPG ou WEBP · Máximo 5MB por foto · Até 20 fotos</p>
                {photos.length > 0 && <p className="text-xs text-terra font-medium mt-1">{photos.length}/20 fotos adicionadas</p>}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Preview grid */}
      {photos.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-ink-soft/60">Arraste para reordenar · A primeira foto é a capa do anúncio</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {photos.map((url, idx) => (
              <div
                key={url}
                draggable
                onDragStart={() => onDragStart(idx)}
                onDragOver={(e) => onDragOver(e, idx)}
                onDragEnd={onDragEnd}
                className={`group relative aspect-square rounded-xl overflow-hidden border-2 cursor-move transition-all ${idx === 0 ? 'border-terra ring-2 ring-terra/20' : 'border-border'} ${draggedIdx === idx ? 'opacity-40 scale-95' : ''}`}
              >
                <Image src={url} alt={`Foto ${idx + 1}`} fill className="object-cover" sizes="200px" />

                {/* Número */}
                <div className="absolute top-1.5 left-1.5 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded font-mono backdrop-blur-sm">
                  {idx + 1}
                </div>

                {/* Badge capa */}
                {idx === 0 && (
                  <div className="absolute bottom-1.5 left-1.5 bg-terra text-white text-[10px] px-1.5 py-0.5 rounded font-semibold tracking-wide uppercase">
                    Capa
                  </div>
                )}

                {/* Botão remover */}
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); removePhoto(idx); }}
                  className="absolute top-1.5 right-1.5 bg-red text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={13} />
                </button>

                {/* Ícone arrastar */}
                <div className="absolute bottom-1.5 right-1.5 text-white/60 opacity-0 group-hover:opacity-100 transition-opacity">
                  <GripVertical size={14} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
