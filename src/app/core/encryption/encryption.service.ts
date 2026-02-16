import { inject, Injectable } from '@angular/core';
import { environment } from '@environment';

import { EncryptionStrategy } from './encryption.strategy';
import { AesStrategy } from './aes.strategy';
import { EcdhStrategy } from './ecdh.strategy';
import { CustomStrategy } from './custom.strategy';

@Injectable({ providedIn: 'root' })
export class EncryptionService {

  private strategy!: EncryptionStrategy;

  // Use lazy injection to avoid circular dependencies
  private aes = inject(AesStrategy);
  private ecdh = inject(EcdhStrategy);
  private custom = inject(CustomStrategy);

  async init() {
    this.strategy = environment.encryptionMethod === 'ECDH'  ? this.ecdh 
      : environment.encryptionMethod === 'AES' ? this.aes : this.custom;

    await this.strategy.init?.();
  }

  encrypt(data: any) {
    return this.strategy.encrypt(data);
  }

  decrypt(payload: string) {
    return this.strategy.decrypt(payload);
  }
}
