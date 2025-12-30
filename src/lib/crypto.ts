/**
 * Secure credential encryption utilities using Web Crypto API
 *
 * Note: This provides obfuscation for stored credentials.
 * For production, consider using secure session management instead of storing passwords.
 */

const ENCRYPTION_KEY_NAME = 'tymes_enc_key';

/**
 * Generate or retrieve encryption key
 */
async function getEncryptionKey(): Promise<CryptoKey> {
  const storedKey = sessionStorage.getItem(ENCRYPTION_KEY_NAME);

  if (storedKey) {
    const keyData = JSON.parse(storedKey);
    return crypto.subtle.importKey('jwk', keyData, { name: 'AES-GCM', length: 256 }, true, [
      'encrypt',
      'decrypt',
    ]);
  }

  // Generate new key
  const key = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, [
    'encrypt',
    'decrypt',
  ]);

  // Export and store key
  const exportedKey = await crypto.subtle.exportKey('jwk', key);
  sessionStorage.setItem(ENCRYPTION_KEY_NAME, JSON.stringify(exportedKey));

  return key;
}

/**
 * Encrypt a string value
 */
export async function encryptValue(value: string): Promise<string> {
  try {
    const key = await getEncryptionKey();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoder = new TextEncoder();
    const data = encoder.encode(value);

    const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, data);

    // Combine IV and encrypted data
    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encrypted), iv.length);

    // Convert to base64
    return btoa(String.fromCharCode(...combined));
  } catch {
    // Fallback to simple encoding if crypto fails
    return btoa(value);
  }
}

/**
 * Decrypt a string value
 */
export async function decryptValue(encryptedValue: string): Promise<string> {
  try {
    const key = await getEncryptionKey();

    // Decode from base64
    const combined = new Uint8Array(
      atob(encryptedValue)
        .split('')
        .map(c => c.charCodeAt(0))
    );

    // Extract IV and data
    const iv = combined.slice(0, 12);
    const data = combined.slice(12);

    const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data);

    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  } catch {
    // Fallback to simple decoding
    try {
      return atob(encryptedValue);
    } catch {
      return '';
    }
  }
}

/**
 * Clear encryption key (call on logout)
 */
export function clearEncryptionKey(): void {
  sessionStorage.removeItem(ENCRYPTION_KEY_NAME);
}
