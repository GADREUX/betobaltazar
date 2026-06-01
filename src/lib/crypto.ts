/**
 * Criptografia AES-256-GCM para campos sensíveis (CPF, RG, dados bancários)
 * Usa a Web Crypto API — funciona no browser e no Node.js (Next.js)
 */

const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;

// Deriva uma chave AES a partir da env var ENCRYPTION_KEY
async function getKey(): Promise<CryptoKey> {
  const secret = process.env.ENCRYPTION_KEY || process.env.NEXT_PUBLIC_ENCRYPTION_KEY;
  if (!secret) throw new Error('ENCRYPTION_KEY não configurada nas variáveis de ambiente');

  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret.slice(0, 32).padEnd(32, '0')), // garante 32 bytes
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: encoder.encode('beto-baltazar-salt'),
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: ALGORITHM, length: KEY_LENGTH },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Criptografa um texto. Retorna string base64 com IV + dados criptografados.
 * Retorna null se o input for null/undefined/vazio.
 */
export async function encrypt(plaintext: string | null | undefined): Promise<string | null> {
  if (!plaintext) return null;
  try {
    const key = await getKey();
    const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV para GCM
    const encoder = new TextEncoder();

    const encrypted = await crypto.subtle.encrypt(
      { name: ALGORITHM, iv },
      key,
      encoder.encode(plaintext)
    );

    // Combina IV + dados criptografados e converte para base64
    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encrypted), iv.length);

    return btoa(String.fromCharCode(...combined));
  } catch (err) {
    console.error('Erro ao criptografar:', err);
    return null;
  }
}

/**
 * Descriptografa um valor previamente criptografado com encrypt().
 * Retorna null se o input for null/inválido.
 */
export async function decrypt(ciphertext: string | null | undefined): Promise<string | null> {
  if (!ciphertext) return null;
  try {
    const key = await getKey();

    // Decodifica base64
    const combined = Uint8Array.from(atob(ciphertext), c => c.charCodeAt(0));

    // Separa IV (12 bytes) dos dados criptografados
    const iv = combined.slice(0, 12);
    const data = combined.slice(12);

    const decrypted = await crypto.subtle.decrypt(
      { name: ALGORITHM, iv },
      key,
      data
    );

    return new TextDecoder().decode(decrypted);
  } catch {
    // Se falhar (chave errada, dado corrompido, campo já em texto puro), retorna null
    return null;
  }
}

/**
 * Tenta descriptografar — se falhar, retorna o valor original (para retrocompatibilidade
 * com dados já cadastrados antes da criptografia).
 */
export async function decryptSafe(value: string | null | undefined): Promise<string | null> {
  if (!value) return null;
  const decrypted = await decrypt(value);
  return decrypted ?? value; // fallback para o valor em texto puro se não for criptografado
}

/**
 * Criptografa um objeto parcial — só os campos sensíveis.
 */
export async function encryptSensitiveFields<T extends Record<string, any>>(
  data: T,
  fields: readonly (keyof T)[]
): Promise<T> {
  const result = { ...data };
  for (const field of fields) {
    if (result[field]) {
      result[field] = await encrypt(String(result[field])) as any;
    }
  }
  return result;
}

/**
 * Descriptografa um objeto parcial — só os campos sensíveis.
 */
export async function decryptSensitiveFields<T extends Record<string, any>>(
  data: T,
  fields: readonly (keyof T)[]
): Promise<T> {
  const result = { ...data };
  for (const field of fields) {
    if (result[field]) {
      result[field] = await decryptSafe(String(result[field])) as any;
    }
  }
  return result;
}

// Campos sensíveis por tabela
export const SENSITIVE_FIELDS = {
  owners: ['cpf', 'rg', 'bank_info'] as const,
  tenants: ['cpf', 'rg', 'emergency_contact'] as const,
};
