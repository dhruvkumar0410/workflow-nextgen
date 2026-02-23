import { Injectable } from '@angular/core';
import { environment } from '@environment';

import { EncryptionService } from './../encryption/encryption.service';

import { IAPIOptions, RequestType } from '../../core/encryption/custom.strategy';

@Injectable({ providedIn: 'root' })
export class Utils {

    public static get OAK(): string { return environment.secretKey; }

    constructor(
        private encryptionService: EncryptionService
    ) { }

    async setLoginDetails(dtls: any) {
        if (!dtls) return;

        const encrypted: any = await this.encryptionService.encryptString(JSON.stringify(dtls));
        localStorage.setItem('wmLgDtls', encrypted);
    }

    async getLoginDetails() {
        const dtls = localStorage.getItem('wmLgDtls');
        if (!dtls) return null;

        const details: any = await this.encryptionService.decryptString(dtls);
        return JSON.parse(details);
    }

    async setAccessToken(token: string) {
        if (!token) return;

        const encrypted: any = await this.encryptionService.encryptString(token);
        localStorage.setItem('wmTkn', encrypted);
    }

    async getAccessToken() {
        const dtls: any = await this.getLoginDetails();
        if (!dtls?.token) return null;        
        return dtls.token.toString();
    }

    async setStringByKey(key: any, dtls: any) {
        if (!key || !dtls) {
            return
        };

        const encrypted = await this.encryptionService.encryptString(dtls);
        localStorage.setItem(key, encrypted);
    }

    async getStringByKey(key: any) {
        const value = localStorage.getItem(key);
        if (!value) return null;

        return await this.encryptionService.decryptString(value);
    }

    async setDetailByKey(key: any, dtls: any) {
        if (!key || !dtls) {
            return
        };

        const encrypted = await this.encryptionService.encryptString(JSON.stringify(dtls));
        localStorage.setItem(key, encrypted);
    }

    async getDetailByKey(key: any) {
        const value = localStorage.getItem(key);
        if (!value) return null;

        const returnValue: any = await this.encryptionService.decryptString(value);

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