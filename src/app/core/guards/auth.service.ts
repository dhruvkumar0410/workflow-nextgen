import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environment';
import { lastValueFrom } from 'rxjs';
import { Utils } from '../utils/utils';
import { RequestType } from '../../core/encryption/custom.strategy';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private observe: any = {
    observe: 'response',
    reportProgress: false,
    responseType: 'text',
    withCredentials: true
  }

  constructor(
    private http: HttpClient,
    private utils: Utils
  ) { }

  async isAuthenticated(): Promise<boolean> {
    const token: any = await this.utils.getAccessToken() ?? false;
    
    return token;
  }

  logout() {
    this.utils.removeItemByKey('wmLgDtls');
    this.callSSO();
  }

  callSSO() {
    const url = environment.ssoLoginUrl
      + 'authorize?response_type=code&client_id='
      + environment.workflowCI
      + "&redirect_uri=" + environment.appBaseURL;

    window.location.href = url;
  }

  async getAuthenticateDataByAuthCode(data: any) {
    const results = await lastValueFrom(this.http.post(environment.servicePHPURL, data, {
      observe: 'response',
      reportProgress: false,
      responseType: 'text',
      withCredentials: true
    }));

    return results;
  }

  async refreshToken(): Promise<string | null> {
    try {
      let loginDetails: any = await this.utils.getLoginDetails();

      if (!loginDetails?.refToken) {
        this.logout();
        return null;
      }

      const url = environment.outpostURL + 'token?grant_type=refresh_token' + '&refresh_token=' + 
        loginDetails?.refToken + '&client_id=' + environment.workflowCI + 
        '&client_secret=' + environment.workflowCS;
      const apiOptions = this.utils.buildApiOptions(url, RequestType.POST);

      const response: any = await lastValueFrom(
        this.http.post(environment.servicePHPURL, apiOptions, this.observe)
      );

      if (response?.status === 200 && response?.body) {
        const body: any = response.body;
        loginDetails.token = body?.access_token;
        
        this.utils.removeItemByKey('wmLgDtls');
        await this.utils.setLoginDetails(loginDetails);
        
        return body?.access_token;  
      }

      this.logout();
      return null;

    } catch (error) {
      console.error('Refresh token failed', error);
      this.logout();
      return null;
    }
  }
}
