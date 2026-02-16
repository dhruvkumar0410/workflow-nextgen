import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environment';

import { BehaviorSubject, lastValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SharedService {

  constructor (
    private http: HttpClient
  ) {}
  
  private collapseSidebar = new BehaviorSubject<boolean>(false);
  collapseSidebar$ = this.collapseSidebar.asObservable();

  handleCollapseSidebar(state: boolean) {
    this.collapseSidebar.next(state);
  }

  /** Sample Code, Need to remove once added one actual API Call */
  async getUserAccounts(data: any): Promise<any> {
    const results = await lastValueFrom(this.http.post(environment.servicePHPURL, data, {
      observe: 'response',
      reportProgress: false,
      responseType: 'text',
      withCredentials: true
    }));
    return results;
  }

  async getUserAccounts1(): Promise<any> {
    const results = await lastValueFrom(this.http.get("https://workflow.mappls.com/userManagement/v2/accounts?platform=1", {
      observe: 'response',
      reportProgress: false,
      responseType: 'text',
      withCredentials: true
    }));
    return results;
  }
  /** Sample Code, Need to remove once added one actual API Call */
}
