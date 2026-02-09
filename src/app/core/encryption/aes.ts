import { Injectable } from '@angular/core';
import { Utils } from '../utils/utils';

@Injectable({ providedIn: 'root' })
export class AESEncryptionService {

  private encoder = new TextEncoder();
  private decoder = new TextDecoder();

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
}
