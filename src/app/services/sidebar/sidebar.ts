import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environment';
import { lastValueFrom } from 'rxjs';

import { RequestType } from '../../core/encryption/custom.strategy';
import { Utils } from '../../core/utils/utils';

@Injectable({
  providedIn: 'root',
})
export class Sidebar {

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

  async userHierarchy(): Promise<any> {
    const url = environment.apiBaseUrl + 'userMgmt/accounts';
    const apiOptions = this.utils.buildApiOptions(
      url,
      RequestType.GET
    );

    const results = await lastValueFrom(
      this.http.post(environment.servicePHPURL, apiOptions, this.observe)
    );

    return results;
  }
}
