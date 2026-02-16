import { Injectable } from '@angular/core';
import { environment } from '@environment';

import { CustomStrategy, IAPIOptions, RequestType } from '../../core/encryption/custom.strategy';

@Injectable({ providedIn: 'root' })
export class Utils {

    public static get OAK(): string { return environment.secretKey; }

    constructor(
        private customStrategy: CustomStrategy
    ) { }

    async setAccessToken(token: string) {
        if (!token) return;

        const encrypted: any = await this.customStrategy.encryptString(token);
        localStorage.setItem('wmTkn', encrypted);
    }

    async getAccessToken() {
        const token = localStorage.getItem('wmTkn');
        if (!token) return null;

        return await this.customStrategy.decryptString(token);
    }

    async setStringByKey(key: any, dtls: any) {
        if (!key || !dtls) {
            return
        };

        const encrypted = await this.customStrategy.encryptString(dtls);
        localStorage.setItem(key, encrypted);
    }

    async getStringByKey(key: any) {
        const value = localStorage.getItem(key);
        if (!value) return null;

        return await this.customStrategy.decryptString(value);
    }

    async setDetailByKey(key: any, dtls: any) {
        if (!key || !dtls) {
            return
        };

        const encrypted = await this.customStrategy.encryptString(JSON.stringify(dtls));
        localStorage.setItem(key, encrypted);
    }

    async getDetailByKey(key: any) {
        const value = localStorage.getItem(key);
        if (!value) return null;

        const returnValue: any = await this.customStrategy.decryptString(value);

        return await JSON.parse(returnValue);
    }

    removeItemByKey(key: any) {
        if (key) localStorage.removeItem(key);
    }

    buildApiOptions(url: string, method: RequestType, body: any = ""): IAPIOptions {
        return {
            RequestURL: url,
            RequestMethod: method,
            RequestBody: body
        };
    }
}