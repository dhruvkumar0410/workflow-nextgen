import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ECDHEncryptionService {
    private serverPublicKey: CryptoKey | null = null;
    private clientKeyPair: CryptoKeyPair | null = null;

    constructor(private http: HttpClient) {}

    // Generate the ECDH key pair on the client-side (Angular)
    async generateClientKeyPair(): Promise<void> {
        this.clientKeyPair = await window.crypto.subtle.generateKey(
            {
                name: 'ECDH',
                namedCurve: 'P-256', // Elliptic Curve P-256
            },
            true, // Extractable
            ['deriveKey', 'deriveBits']
        );
    }

    // Export the public key in Base64 to send to the backend
    async exportClientPublicKey(): Promise<string> {
        if (!this.clientKeyPair) {
            throw new Error('Client key pair not generated');
        }

        const exported = await window.crypto.subtle.exportKey('spki', this.clientKeyPair.publicKey);
        return btoa(String.fromCharCode(...new Uint8Array(exported)));
    }

    // Send the client public key to the server and get the server public key
    async exchangePublicKeys(): Promise<void> {
        await this.generateClientKeyPair();
        const clientPublicKey = await this.exportClientPublicKey();

        // Send the client public key to the server and get the server public key
        const response = await lastValueFrom(
            this.http.post<{ serverPublicKey: string }>('/api/ecdhe/exchange', {
                clientPublicKey: clientPublicKey
            })
        );

        // Import the server's public key
        const serverPublicKeyBuffer = Uint8Array.from(atob(response.serverPublicKey), (c) => c.charCodeAt(0));
        this.serverPublicKey = await window.crypto.subtle.importKey(
            'spki',
            serverPublicKeyBuffer,
            { name: 'ECDH', namedCurve: 'P-256' },
            false, // Not extractable
            []
        );
    }

    // Compute the shared secret based on the server's public key
    async computeSharedSecret(serverPublicKeyBase64: any): Promise<void> {
        if (!this.clientKeyPair) {
            throw new Error('Client key pair not generated');
        }

        // Import the server's public key
        const serverPublicKeyBuffer = Uint8Array.from(atob(serverPublicKeyBase64), (c) => c.charCodeAt(0));
        const serverPublicKey = await window.crypto.subtle.importKey(
            'spki',
            serverPublicKeyBuffer,
            { name: 'ECDH', namedCurve: 'P-256' },
            false, // Not extractable
            []
        );

        // Derive the shared secret using the client's private key and server's public key
        const sharedSecret = await window.crypto.subtle.deriveKey(
            { name: 'ECDH', public: serverPublicKey },
            this.clientKeyPair.privateKey,
            { name: 'AES-GCM', length: 256 },
            true, // Extractable
            ['encrypt', 'decrypt']
        );

        sessionStorage.setItem('_ask', await this.arrayBufferToBase64(sharedSecret));
    }

    private async arrayBufferToBase64(buffer: CryptoKey): Promise<string> {
        const exported = await window.crypto.subtle.exportKey('raw', buffer);
        return btoa(String.fromCharCode(...new Uint8Array(exported)));
    }

    async getSharedSecretFromSessionStorage(): Promise<CryptoKey | null> {
        const storedSharedSecret = sessionStorage.getItem('_ask');
        if (storedSharedSecret) {
            // Import the shared secret from Base64
            const sharedSecretBuffer = Uint8Array.from(atob(storedSharedSecret), (c) => c.charCodeAt(0));
            return window.crypto.subtle.importKey(
                'raw',
                sharedSecretBuffer,
                { name: 'AES-GCM', length: 256 },
                true, // Extractable
                ['encrypt', 'decrypt']
            ).then((key) => key);
        }
        return null;
    }

    // Encrypt data using AES
    async encryptData(data: any): Promise<string> {
        const existingSecret = await this.getSharedSecretFromSessionStorage();
        if (!existingSecret) {
            throw new Error('Shared secret not computed');
        }

        const iv = window.crypto.getRandomValues(new Uint8Array(12)); // Initialization vector
        const encodedData = new TextEncoder().encode(data);

        const encryptedData = await window.crypto.subtle.encrypt(
            { name: 'AES-GCM', iv },
            existingSecret,
            encodedData
        );

        const encryptedBase64 = btoa(String.fromCharCode(...new Uint8Array(encryptedData)));
        return encryptedBase64;
    }

    // Decrypt data using AES
    async decryptData(data: any): Promise<string> {
        const existingSecret = await this.getSharedSecretFromSessionStorage();
        if (!existingSecret) {
            throw new Error('Shared secret not computed');
        }

        const encryptedData = Uint8Array.from(atob(data), (c) => c.charCodeAt(0));
        const iv = new Uint8Array(12); // Same IV used for encryption (this should ideally be sent separately)

        const decryptedData = await window.crypto.subtle.decrypt(
            { name: 'AES-GCM', iv },
            existingSecret,
            encryptedData
        );

        return new TextDecoder().decode(decryptedData);
    }

    // Utility method to generate encryption/decryption key between client and server
    async processEncryptionDecryptionKey(): Promise<boolean> {
        try {
            // Step 1: Exchange public keys between client and server
            await this.exchangePublicKeys();

            // Step 2: Compute shared secret based on the server's public key
            await this.computeSharedSecret(this.serverPublicKey);

            return true;
        } catch (error) {
            console.error('Error during encryption/decryption key sharing', error);
            throw error;
        }
    }
}
