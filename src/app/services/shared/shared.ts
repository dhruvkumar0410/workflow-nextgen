import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environment';
import { BehaviorSubject, lastValueFrom } from 'rxjs';

import { IAPIOptions, RequestType } from '../../core/encryption/custom.strategy';
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
    const apiOptions = this.utils.buildApiOptions(url, RequestType.GET)
    const results = await lastValueFrom(
      this.http.post(environment.servicePHPURL, apiOptions,this.observe),
    );
    return results;
  }

  /* get Account */
  async getAccounts(): Promise<any> {
    const url = environment.apiBaseUrl + 'userMgmt/accounts';
    const apiOptions = this.utils.buildApiOptions(url, RequestType.GET);
    const results = await lastValueFrom(
      this.http.post(environment.servicePHPURL, apiOptions, this.observe),
    );
    return results;
  }
}
