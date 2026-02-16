import { AESEncryptionService } from '../encryption/aes';
import { Injectable } from '@angular/core';
import { environment } from '@environment';
@Injectable({ providedIn: 'root' })
export class Utils {

    public static get OAK(): string { return environment.secretKey; }

    constructor(private aesStrategy: AESEncryptionService) { }

    async setAccessToken(token: string) {
        if (!token) return;

        const encrypted = await this.aesStrategy.encrypt256(token);
        localStorage.setItem('wmTkn', encrypted);
    }

    async getAccessToken() {
        const token = localStorage.getItem('wmTkn');
        if (!token) return null;

        return await this.aesStrategy.decrypt256(token);
    }

    async setStringByKey(key: any, dtls: any) {
        if (!key || !dtls) {
            return
        };

        const encrypted = await this.aesStrategy.encrypt256(dtls);
        localStorage.setItem(key, encrypted);
    }

    async getStringByKey(key: any) {
        const value = localStorage.getItem(key);
        if (!value) return null;

        return await this.aesStrategy.decrypt256(value);
    }

    async setDetailByKey(key: any, dtls: any) {
        if (!key || !dtls) {
            return
        };

        const encrypted = await this.aesStrategy.encrypt256(JSON.stringify(dtls));
        localStorage.setItem(key, encrypted);
    }

    async getDetailByKey(key: any) {
        const value = localStorage.getItem(key);
        if (!value) return null;

        const returnValue: any = this.aesStrategy.decrypt256(value);

        return await JSON.parse(returnValue);
    }

    removeItemByKey(key: any) {
        if (key) localStorage.removeItem(key);
    }

    // prepare
}