import { Injectable } from '@angular/core';

import { EncryptionStrategy } from './encryption.strategy';

import { Utils } from '../utils/utils';

@Injectable({providedIn: "root"})
export class AesStrategy implements EncryptionStrategy {

  private encoder = new TextEncoder();
  private decoder = new TextDecoder();
  private key!: CryptoKey;

  async init() {
    const rawKey = Uint8Array.from(
      atob(Utils.OAK),
      c => c.charCodeAt(0)
    );

    this.key = await crypto.subtle.importKey(
      'raw',
      rawKey,
      'AES-GCM',
      false,
      ['encrypt', 'decrypt']
    );
  }

  async encrypt(data: any): Promise<string> {
    const iv = crypto.getRandomValues(new Uint8Array(12));

    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      this.key,
      this.encoder.encode(JSON.stringify(data))
    );

    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encrypted), iv.length);

    return btoa(String.fromCharCode(...combined));
  }

  async decrypt(payload: string): Promise<any> {
    const combined = Uint8Array.from(atob(payload), c => c.charCodeAt(0));
    const iv = combined.slice(0, 12);
    const data = combined.slice(12);

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      this.key,
      data
    );

    return JSON.parse(this.decoder.decode(decrypted));
  }

  async encryptString(value: any): Promise<string> {
    const iv = crypto.getRandomValues(new Uint8Array(12));

    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      this.key,
      this.encoder.encode(value)
    );

    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encrypted), iv.length);

    return btoa(String.fromCharCode(...combined));
  }

  async decryptString(value: any): Promise<any> {
    const combined = Uint8Array.from(atob(value), c => c.charCodeAt(0));
    const iv = combined.slice(0, 12);
    const data = combined.slice(12);

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      this.key,
      data
    );

    return this.decoder.decode(decrypted);
  }
}
