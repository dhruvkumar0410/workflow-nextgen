import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom, Observable } from 'rxjs';
import { environment } from '@environment';
import { IAPIOptions, RequestType } from '../../core/encryption/custom.strategy';

@Injectable({
  providedIn: 'root',
})
export class Sidebar {

  constructor(private http :HttpClient){}
  
  async userHierarchy(): Promise<any> {
    const url = environment.apiBaseUrl + 'userMgmt/accounts';
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
