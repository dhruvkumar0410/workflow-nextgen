import { inject, Injector } from '@angular/core';
import { HttpRequest, HttpResponse, HttpInterceptorFn } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '@environment';

import { catchError, from, map, of, switchMap, throwError } from 'rxjs';

import { AuthService } from '../guards/auth.service';
import { IAPIOptions } from '../encryption/custom.strategy';
import { EncryptionService } from '../encryption/encryption.service';

import { Utils } from '../utils/utils';

export const requestInterceptor: HttpInterceptorFn = (req, next) => {

  const router = inject(Router);
  const authService = inject(AuthService);
  const encryptionService = inject(EncryptionService);
  const utils = inject(Utils);
  
  let modifiedReq = req;

  // /* -----------------------------------------
  //   1. Inject Authorization token
  // ----------------------------------------- */
  const token: any = utils.getAccessToken();
  if (token && (environment.encryptionMethod !== 'CUSTOM'
    || (environment.encryptionMethod === 'CUSTOM'
      && !isIAPIOptions(modifiedReq.body) && !isBypass(modifiedReq)))) {
    modifiedReq = modifiedReq.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // /* -----------------------------------------
  //   2. Encrypt request body (BODY ONLY)
  // ----------------------------------------- */
  if (environment.requestEncryption && !isBypass(modifiedReq)) {
    return from(encryptionService.encrypt(modifiedReq.body)).pipe(
      switchMap(encryptedBody => {
        const encryptedReq = modifiedReq.clone({
          body: encryptedBody,
          headers: modifiedReq.headers.set('Content-Type', 'text/plain')
        });

        return handleResponse(encryptedReq, next, router, authService, encryptionService);
      })
    );
  }

  // /* -----------------------------------------
  //   3. Plain request
  // ----------------------------------------- */
  return handleResponse(modifiedReq, next, router, authService, encryptionService);
}

/* -----------------------------------------
  Centralized response + error handling
----------------------------------------- */
function handleResponse(req: HttpRequest<any>, next: any,
  router: Router, authService: AuthService, encryptionService: EncryptionService) {
  return next(req).pipe(

    /* -------- Decrypt response -------- */
    switchMap(event => {
      if (event instanceof HttpResponse && environment.responseEncryption
        && event?.body && !isBypass(req)) {
        return from(encryptionService.decrypt(event.body)).pipe(
          map(decrypted => event.clone({ body: decrypted }))
        );
      }
      return of(event);
    }),

    /* -------- Handle 401 / 403 -------- */
    catchError(err => {
      if (err.status === 401 || err.status === 403) {
        authService.logout();
        router.navigate(['/']);
      }
      return throwError(() => err);
    })
  );
}

function isBypass(req: HttpRequest<any>) {
  return (
    req.url.includes('/assets/i18n/')
    || req.url.endsWith('.json')
    || req.url.includes('/auth')
    || req.url.includes('/public')
  );
}

function isIAPIOptions(body: any) {
  return (
    body &&
    typeof body === 'object'
    && 'RequestURL' in body
    && 'RequestMethod' in body
  );
}
