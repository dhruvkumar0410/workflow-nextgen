import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environment';
import { lastValueFrom } from 'rxjs';
import { Utils } from '../utils/utils';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private utils: Utils
  ) { }

  async isAuthenticated(): Promise<boolean> {
    const token: any = await this.utils.getAccessToken() ?? false;
    
    return token;
  }

  logout() {
    this.utils.removeItemByKey('wmTkn');
    this.utils.removeItemByKey('wmDtls');

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
}
