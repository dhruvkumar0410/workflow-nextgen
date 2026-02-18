import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { environment } from '@environment';

import { IAPIOptions, RequestType } from '../encryption/custom.strategy';
import { Utils } from '../utils/utils';

import { AuthService } from './auth.service';
import { Shared } from '../../services/shared/shared';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private utils: Utils,
    private authService: AuthService,
    private shared: Shared
  ) { }

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {

    const routeId = next.paramMap.get('process_id');
    const validId = (await this.utils.getDetailByKey('wmAccDtls'))?.[0]?.process_id?.toString();
    if (validId && routeId !== validId) {
      await this.router.navigate(['/process', validId]);
      return false;
    } 

    // Check if the user is authenticated
    const isAuthenticated = await this.authService.isAuthenticated();

    if (isAuthenticated) {
      return true;
    }
    const code = new URLSearchParams(window.location.search).get('code');

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
      const details = {
        token: body.access_token,
        refToken: body.refresh_token
      }
      
      await this.utils.setLoginDetails(details);
      await this.getAccounts();
      await this.getUserDetails();
      this.router.navigate(['/']);
    } else {
      this.authService.callSSO();
    }
  }

  async getUserDetails() {
    try {
      const response: any = await this.shared.userDetail();
      if (response?.body) {
        let details: any = await this.utils.getLoginDetails();
        details.userDetails = response.body;
        this.utils.removeItemByKey('wmLgDtls');
        await this.utils.setLoginDetails(details);
      }
    } catch (error) {
      console.error('Failed to fetch user details', error);
    }
  }
  async getAccounts(){
    try {
      const response: any = await this.shared.getAccounts();
      if (response?.body) {
        let details: any = await this.utils.getLoginDetails();
        details.processes = response?.body[0]?.projects[0]?.processes;
        this.utils.removeItemByKey('wmLgDtls');
        await this.utils.setLoginDetails(details);
      }
    } catch (error) {
      console.error('Failed to fetch account details', error);
    }
  }
}
