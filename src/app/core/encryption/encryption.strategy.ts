export interface EncryptionStrategy {
  init?(): Promise<void>;
  encrypt(data: any): Promise<string>;
  decrypt(payload: string): Promise<any>;
}
