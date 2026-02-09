import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('_tkn');
    return !!token; // Return true if token exists, false otherwise
  }

  logout() {
    localStorage.removeItem('_tkn');
  }
}
