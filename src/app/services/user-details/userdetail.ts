import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environment';
import { lastValueFrom } from 'rxjs';

import { IAPIOptions, RequestType } from '../../core/encryption/custom.strategy';
import { Utils } from '../../core/utils/utils';


@Injectable({
  providedIn: 'root',
})
export class Userdetail {
  
  constructor(
    private http: HttpClient,
    private utils: Utils
  ) { }

  async userDetail(): Promise<any> {
    const token: any = await this.utils.getAccessToken();
    const url = environment.anchorUrl + 'users?access_token=' + token;
    let apiOptions: IAPIOptions = {
      RequestURL: url,
      RequestMethod: RequestType.GET,
      RequestBody: ""
    };
    const results = await lastValueFrom(this.http.post(environment.servicePHPURL, apiOptions, {
      observe: 'response',
      reportProgress: false,
      responseType: 'text',
      withCredentials: true
    }));

    return results;
  }
}
