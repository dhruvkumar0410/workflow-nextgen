import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environment';
import { BehaviorSubject, lastValueFrom } from 'rxjs';

import { RequestType } from '../../core/encryption/custom.strategy';
import { Utils } from '../../core/utils/utils';

@Injectable({
  providedIn: 'root',
})
export class Shared {
  private collapseSidebar = new BehaviorSubject<boolean>(false);
  collapseSidebar$ = this.collapseSidebar.asObservable();

  private observe: any = {
    observe: 'response',
    reportProgress: false,
    responseType: 'text',
    withCredentials: true,
  };

  constructor(
    private http: HttpClient,
    private utils: Utils,
  ) {}

  handleCollapseSidebar(state: boolean) {
    this.collapseSidebar.next(state);
  }

  /* User Detail */
  async userDetail(): Promise<any> {
    const token: any = await this.utils.getAccessToken();
    const url = environment.anchorUrl + 'users?access_token=' + token;
    const apiOptions = this.utils.buildApiOptions(url, RequestType.GET);
    const results = await lastValueFrom(
      this.http.post(environment.servicePHPURL, apiOptions, this.observe),
    );
    return results;
  }

  /* get Account */
  // async getAccounts(): Promise<any> {
  //   const token: any = await this.utils.getAccessToken();
  //   const url = environment.apiBaseUrl + 'userMgmt/accounts?platform=1';
  //   const apiOptions = this.utils.buildApiOptions(url, RequestType.GET);
  //   const results = await lastValueFrom(
  //     this.http.post(environment.servicePHPURL, apiOptions, this.observe),
  //   );
  //   return results;
  // }
  /* need to get token from interceptor and pass it in headers */
  async getAccounts(): Promise<any> {
    const url = environment.apiBaseUrl + 'userMgmt/accounts?platform=1';
    const apiOptions = this.utils.buildApiOptions(url, RequestType.GET);
    const results = await lastValueFrom(
      this.http.post(environment.servicePHPURL, apiOptions, this.observe),
    );
    return results;
  }

  async get_customer_details(searchText: string): Promise<any> {
    const filter = 'query IS ' + searchText;
    const url = environment.apiProdBaseUrl + '977_get_customer_details/v2/data?filterQuery=' + filter;
    const apiOptions = this.utils.buildApiOptions(url, RequestType.GET);
    const results = await lastValueFrom(
      this.http.post(environment.servicePHPURL, apiOptions, this.observe),
    );
    return results;
  }
}
