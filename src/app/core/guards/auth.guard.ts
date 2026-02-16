import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { environment } from '@environment';

import { IAPIOptions, RequestType } from '../encryption/custom.strategy';
import { Utils } from '../utils/utils';

import { AuthService } from './auth.service';
import { Userdetail } from '../../services/user-details/userdetail';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private utils: Utils,
    private authService: AuthService,
    private userDetailService: Userdetail
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
      await this.fetchUserToken(code);
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
      await this.utils.setAccessToken(body?.access_token);
      await this.utils.setDetailByKey('wmDtls', body);
      await this.getUserDetails();
    } else {
      this.authService.callSSO();
    }
  }

  async getUserDetails() {
    try {
      const response: any = await this.userDetailService.userDetail();

      if (response?.body) {
        await this.utils.setDetailByKey('wmUsrDtls', response?.body);
        this.router.navigate(['/']);
      }
    } catch (error) {
      console.error('Failed to fetch user details', error);
    }
  }
}
