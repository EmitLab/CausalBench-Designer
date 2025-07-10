import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private token: string = '';

  constructor() {
    this.loadToken();

    if (!this.token) {
      // window.open('https://causalbench.org', '_self');
    }
  }

  private loadToken() {
    this.token = sessionStorage.getItem('token') || '';
    
    if (!this.token) {
      // When the app loads, ask for token from opener
      if (window.opener) {
        window.opener.postMessage('ready-for-token', 'https://causalbench.org');
      }

      console.log('Opener window:');
      console.log(window.opener);

      // Listen for the token from parent
      window.addEventListener('message', event => {
        console.log('Received message from parent window:');
        console.log(event);
        console.log(event.origin);

        if (event.origin !== 'https://causalbench.org') return;

        const token = event.data?.token;
        if (token) {
          sessionStorage.setItem('token', token);
          // Optionally trigger login or route transition
        }
      });
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
