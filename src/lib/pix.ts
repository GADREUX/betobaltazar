function crc16(payload: string): string {
  let crc = 0xFFFF;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = (crc & 0x8000) ? ((crc << 1) ^ 0x1021) : (crc << 1);
      crc &= 0xFFFF;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

function tlv(id: string, value: string): string {
  return `${id}${value.length.toString().padStart(2, '0')}${value}`;
}

export function generatePixCode(opts: {
  pixKey: string;
  merchantName: string;
  merchantCity: string;
  amount?: number;
  txid?: string;
  description?: string;
}): string {
  const sanitize = (s: string, max: number) =>
    s.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^A-Z0-9 ]/g, '').slice(0, max);

  const txid = (opts.txid ?? '***').replace(/[^A-Za-z0-9]/g, '').slice(0, 25) || '***';

  let payload = tlv('00', '01');
  const gui = tlv('00', 'BR.GOV.BCB.PIX');
  const key = tlv('01', opts.pixKey);
  const desc = opts.description ? tlv('02', opts.description.slice(0, 50)) : '';
  payload += tlv('26', gui + key + desc);
  payload += tlv('52', '0000');
  payload += tlv('53', '986');
  if (opts.amount && opts.amount > 0) payload += tlv('54', opts.amount.toFixed(2));
  payload += tlv('58', 'BR');
  payload += tlv('59', sanitize(opts.merchantName, 25));
  payload += tlv('60', sanitize(opts.merchantCity, 15));
  payload += tlv('62', tlv('05', txid));
  payload += '6304';
  return payload + crc16(payload);
}

export function generateBoletoPixCode(boletoId: string, value: number): string {
  return generatePixCode({
    pixKey: process.env.NEXT_PUBLIC_PIX_KEY || 'betobaltazar@gmail.com',
    merchantName: process.env.NEXT_PUBLIC_CORRETOR_NOME || 'Beto Baltazar',
    merchantCity: process.env.NEXT_PUBLIC_PIX_CIDADE || 'CAPAO BONITO',
    amount: value,
    txid: boletoId.replace(/-/g, '').slice(0, 25),
    description: 'Aluguel',
  });
}
