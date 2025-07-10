import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private token: string = '';

  constructor() {
    this.loadToken();
  }

  private loadToken() {
    this.token = sessionStorage.getItem('token') || '';
    if (!this.token) {
      window.open('https://causalbench.org', '_self');
    }
  }

  getToken(): string {
    return this.token;
  }

  setToken(token: string) {
    this.token = token;
    sessionStorage.setItem('auth_token', token);
  }

  clearToken() {
    this.token = '';
    sessionStorage.removeItem('auth_token');
  }

  hasToken(): boolean {
    return !!this.token;
  }

}
