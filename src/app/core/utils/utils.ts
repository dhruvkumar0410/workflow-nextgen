import { Injectable } from '@angular/core';
import { environment } from '@environment';

@Injectable({ providedIn: 'root' })
export class Utils {

    public static get OAK(): string { return environment.secretKey; }

    public static getLocalStorageData(key: any): any { 
        return localStorage.getItem(key);
    }
  
}