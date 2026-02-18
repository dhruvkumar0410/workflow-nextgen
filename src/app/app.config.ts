import { ApplicationConfig, provideBrowserGlobalErrorListeners, importProvidersFrom, APP_INITIALIZER, provideAppInitializer, inject } from '@angular/core';
import { provideHttpClient, HttpClient, HTTP_INTERCEPTORS, withInterceptors } from '@angular/common/http';
import { provideRouter, withHashLocation } from '@angular/router';
import { environment } from "@environment";

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { provideAnimations } from '@angular/platform-browser/animations';
import { OverlayModule } from '@angular/cdk/overlay';

import { requestInterceptor } from './core/interceptors/interceptor';

import { routes } from './app.routes';
import { EncryptionService } from './core/encryption/encryption.service';

export function httpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, `${environment.appBaseURL}assets/i18n/`, '.json');
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideAnimations(),
    provideHttpClient(withInterceptors([requestInterceptor])),
    provideRouter(routes, withHashLocation()),

    // CDK providers (Overlay is most common)
    importProvidersFrom(OverlayModule),
    
    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage: 'en',
        loader: {
          provide: TranslateLoader,
          useFactory: httpLoaderFactory,
          deps: [HttpClient]
        }
      })
    ),
    provideAppInitializer(() => {
      const enc = inject(EncryptionService);
      return enc.init();
    })
  ]
};
