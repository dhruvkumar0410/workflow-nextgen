import { Injectable } from "@angular/core";

import * as CryptoJS from "crypto-js";

import { EncryptionStrategy } from './encryption.strategy';

import { Utils } from "../utils/utils";

@Injectable({ providedIn: "root" })
export class CustomStrategy implements EncryptionStrategy {

  private key!: string;

  constructor() { }

  async init() {
    this.key = Utils.OAK;
  }

  async encrypt(data: any): Promise<string> {
    let newURL = "";
    if (!data) {
      return "";
    }

    if (data?.Parameters) {
      newURL = this.parseParameters(data.Parameters, data.RequestURL);
    }

    data.Headers = Object.assign(data?.Headers == undefined
      || Object.keys(data?.Headers).length === 0 ? {} : data?.Headers)
    let requestBody = {
      methodType: data?.RequestMethod,
      url: newURL ? encodeURI(newURL) : encodeURI(data?.RequestURL),
      header: data?.Headers,
      contentType: undefined,
      payload: JSON.stringify(data?.RequestBody),
      enableEncryption: true
    }

    let cipherPayLoad = CryptoJS.AES.encrypt(JSON.stringify(requestBody).trim(), this.key).toString();

    return cipherPayLoad;
  }

  async decrypt(payload: string): Promise<any> {
    let decryptedResponseBody
    try {
      decryptedResponseBody = CryptoJS.AES.decrypt(payload, this.key).toString(CryptoJS.enc.Utf8).trim();
    } catch (error) { }

    let returnable = decryptedResponseBody ? this.isJsonString(decryptedResponseBody)
      ? JSON.parse(decryptedResponseBody) : decryptedResponseBody : '';

    return returnable;
  }

  async encryptString(value: any) {
    if (!value) return "";

    return CryptoJS.AES.encrypt(value.trim(), this.key).toString();
  }

  async decryptString(cipherText: any) {
    if (!cipherText) return "";

    try {
      const bytes = CryptoJS.AES.decrypt(cipherText, this.key);
      return bytes.toString(CryptoJS.enc.Utf8).trim();
    } catch (error) {
      return "";
    }
  }

  parseParameters(parameters: any, requestURL: any) {
    let url = requestURL;
    Object.keys(parameters).forEach((key) => {
      url = url.includes("?")
        ? url + "&" + key + "=" + parameters[key]
        : url + "?" + key + "=" + parameters[key];
    });

    return url;
  }

  isJsonString(str: any) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }

    return true;
  }
}

export interface IAPIOptions {
  RequestURL: string;
  RequestMethod: RequestType;
  Parameters?: { [index: string]: string },
  Headers?: { [index: string]: string },
  RequestBody?: Object
}

export enum RequestType {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  PATCH = "PATCH"
}