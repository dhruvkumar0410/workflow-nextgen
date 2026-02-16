import { Injectable } from '@angular/core';
import { Utils } from '../utils/utils';

@Injectable({ providedIn: 'root' })
export class AESEncryptionService {

  private encoder = new TextEncoder();
  private decoder = new TextDecoder();

  private cryptoKey?: CryptoKey;

  /* -----------------------------------------
    Import AES-256-GCM key (Base64)
  ----------------------------------------- */
  private async getKey(): Promise<CryptoKey> {
    const rawKey = Uint8Array.from(
      atob(Utils.OAK),
      c => c.charCodeAt(0)
    );

    return crypto.subtle.importKey(
      'raw',
      rawKey,
      'AES-GCM',
      false,
      ['encrypt', 'decrypt']
    );
  }

  /* -----------------------------------------
    Encrypt → returns SINGLE Base64 string
    Format: Base64( IV || CIPHERTEXT )
  ----------------------------------------- */
  async encryptData(data: any): Promise<string> {
    const key = await this.getKey();
    const iv = crypto.getRandomValues(new Uint8Array(12));

    const cipherBuffer = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      this.encoder.encode(JSON.stringify(data))
    );

    const cipherBytes = new Uint8Array(cipherBuffer);
    const combined = new Uint8Array(iv.length + cipherBytes.length);

    combined.set(iv, 0);
    combined.set(cipherBytes, iv.length);

    return btoa(
      String.fromCharCode(...combined)
    );
  }

  /* -----------------------------------------
    Decrypt ← accepts SINGLE Base64 string
  ----------------------------------------- */
  async decryptData(base64Payload: string): Promise<any> {
    if (!base64Payload || typeof base64Payload !== 'string') {
      return base64Payload;
    }

    const combined = Uint8Array.from(
      atob(base64Payload),
      c => c.charCodeAt(0)
    );

    const iv = combined.slice(0, 12);
    const cipherText = combined.slice(12);

    const key = await this.getKey();

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      cipherText
    );

    return JSON.parse(
      this.decoder.decode(decrypted)
    );
  }

  private cryptoKey256?: CryptoKey;

  /* =====================================================
    AES-256 KEY (derived from existing secretKey)
    Works with ANY key length (192 included)
  ===================================================== */
  private async getKey256(): Promise<CryptoKey> {
    if (this.cryptoKey256) return this.cryptoKey256;

    const raw = Uint8Array.from(
      atob(Utils.OAK),
      c => c.charCodeAt(0)
    );

    // 🔑 derive 256-bit key using SHA-256
    const hash = await crypto.subtle.digest('SHA-256', raw);

    this.cryptoKey256 = await crypto.subtle.importKey(
      'raw',
      hash,              // always 32 bytes (256)
      'AES-GCM',
      false,
      ['encrypt', 'decrypt']
    );

    return this.cryptoKey256;
  }

  /* =====================================================
    🔐 ENCRYPT AES-256
    returns Base64( IV(12) + ciphertext )
  ===================================================== */
  async encrypt256(data: any): Promise<string> {
    const key = await this.getKey256();

    // 12 bytes is required for GCM best practice
    const iv = crypto.getRandomValues(new Uint8Array(12));

    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      this.encoder.encode(JSON.stringify(data))
    );

    const cipherBytes = new Uint8Array(encrypted);

    const combined = new Uint8Array(iv.length + cipherBytes.length);
    combined.set(iv);
    combined.set(cipherBytes, iv.length);

    return btoa(String.fromCharCode(...combined));
  }

  /* =====================================================
    🔓 DECRYPT AES-256
  ===================================================== */
  async decrypt256(payload: string): Promise<any> {
    if (!payload) return null;

    const combined = Uint8Array.from(
      atob(payload),
      c => c.charCodeAt(0)
    );

    const iv = combined.slice(0, 12);
    const cipherText = combined.slice(12);

    const key = await this.getKey256();

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      cipherText
    );

    return JSON.parse(this.decoder.decode(decrypted));
  }
}
