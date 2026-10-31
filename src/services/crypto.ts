/**
 * Cryptographic Password Hashing & Salt Utility using Web Crypto API (SHA-256)
 */

function bufferToHex(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export function generateSalt(length = 16): string {
  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  return Array.from(array)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function hashPassword(password: string, salt?: string): Promise<{ hash: string; salt: string }> {
  const activeSalt = salt || generateSalt();
  const encoder = new TextEncoder();
  const data = encoder.encode(activeSalt + password);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hash = bufferToHex(hashBuffer);
  return { hash, salt: activeSalt };
}

export async function verifyPassword(password: string, storedHash: string, storedSalt: string): Promise<boolean> {
  const { hash } = await hashPassword(password, storedSalt);
  return hash === storedHash;
}
