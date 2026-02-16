import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { environment } from '@environment';

import { Observable } from 'rxjs';

import { AuthService } from './auth.service';

import { IAPIOptions, RequestType } from '../encryption/custom.strategy';
import { Utils } from '../utils/utils';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService,
    private utils: Utils
  ) { }

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    // Check if the user is authenticated
    const isAuthenticated = await this.authService.isAuthenticated();

    if (isAuthenticated) {
      return true;
    }
    const code = next?.queryParamMap?.get('code');

    if (code && code.trim() !== '') {
      this.fetchUserToken(code);
      return true;
    } else {
      this.authService.callSSO();
      return false;
    }
  }

  private async fetchUserToken(code: string) {
    const url = environment.ssoLoginUrl
      + 'token?grant_type=authorization_code&client_id='
      + environment.workflowCI + '&client_secret=' + environment.workflowCS
      + '&redirect_uri=' + environment.appBaseURL + '&code=' + code;

    let apiOptions: IAPIOptions = {
      RequestURL: url,
      RequestMethod: RequestType.POST,
      RequestBody: ""
    };

    let response = await this.authService.getAuthenticateDataByAuthCode(apiOptions);

    if (response?.status == 200 && response?.body) {
      let body: any = response?.body;
      this.utils.setAccessToken(body?.access_token);
      this.utils.setDetailByKey('wmDtls', body);

      this.router.navigate(['/']);
    } else {
      this.authService.callSSO();
    }
  }
}
