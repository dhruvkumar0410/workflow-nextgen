import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  
  private collapseSidebar = new BehaviorSubject<boolean>(false);
  collapseSidebar$ = this.collapseSidebar.asObservable();

  handleCollapseSidebar(state: boolean) {
    this.collapseSidebar.next(state);
  }
}
