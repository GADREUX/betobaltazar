import { format, formatDistanceToNow, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
export const money = (v: number | null | undefined) => (v ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
export const fmtDate = (d: string | Date | null | undefined) => { if (!d) return '—'; try { return format(typeof d === 'string' ? new Date(d) : d, "dd/MM/yyyy", { locale: ptBR }); } catch { return '—'; } };
export const fmtDateTime = (d: string | Date | null | undefined) => { if (!d) return '—'; try { return format(typeof d === 'string' ? new Date(d) : d, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR }); } catch { return '—'; } };
export const timeAgo = (d: string | Date | null | undefined) => { if (!d) return '—'; try { return formatDistanceToNow(typeof d === 'string' ? new Date(d) : d, { addSuffix: true, locale: ptBR }); } catch { return '—'; } };
export const daysUntil = (d: string | Date | null | undefined) => { if (!d) return null; try { return differenceInDays(typeof d === 'string' ? new Date(d) : d, new Date()); } catch { return null; } };
export const fmtPhone = (phone: string) => { const d = phone.replace(/\D/g, ''); if (d.length === 11) return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`; if (d.length === 10) return `(${d.slice(0,2)}) ${d.slice(2,6)}-${d.slice(6)}`; return phone; };
export const cn = (...classes: (string | boolean | undefined | null)[]) => classes.filter(Boolean).join(' ');
