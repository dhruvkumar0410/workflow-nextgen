import { Injectable } from '@angular/core';

import { EncryptionStrategy } from './encryption.strategy';
import { SharedService } from '../../shared/services/shared';
import { lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({providedIn: "root"})
export class EcdhStrategy implements EncryptionStrategy {

  private aesKey!: CryptoKey;
  private encoder = new TextEncoder();
  private decoder = new TextDecoder();

  constructor(private http: HttpClient) {}

  async init() {
    // Generate ECDH key pair
    const keyPair = await crypto.subtle.generateKey(
      { name: 'ECDH', namedCurve: 'P-256' },
      false,
      ['deriveKey']
    );

    const clientPubKey = await crypto.subtle.exportKey(
      'raw',
      keyPair.publicKey
    );

    // Exchange keys (single call)
    const serverPubKeyBase64 = await lastValueFrom(this.http
    .post<string>('/api/ecdh/exchange', {
      clientPublicKey: btoa(
        String.fromCharCode(...new Uint8Array(clientPubKey))
      )
    }));

    const serverPubKey = await crypto.subtle.importKey(
      'raw',
      Uint8Array.from(atob(serverPubKeyBase64!), c => c.charCodeAt(0)),
      { name: 'ECDH', namedCurve: 'P-256' },
      false,
      []
    );

    // Derive AES key
    this.aesKey = await crypto.subtle.deriveKey(
      { name: 'ECDH', public: serverPubKey },
      keyPair.privateKey,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }

  async encrypt(data: any): Promise<string> {
    const iv = crypto.getRandomValues(new Uint8Array(12));

    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      this.aesKey,
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
      this.aesKey,
      data
    );

    return JSON.parse(this.decoder.decode(decrypted));
  }
}
