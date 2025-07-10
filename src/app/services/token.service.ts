import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  token$ = new ReplaySubject<string>(1);

  constructor() {
    this.loadToken();
  }

  private loadToken() {
    let token = sessionStorage.getItem('token') || '';
    
    if (token) {
      // If token exists in session storage, set it immediately
      this.setToken(token);
    }
    else {
      // Check if the window has an opener
      if (!window.opener) {
        window.open('https://causalbench.org', '_self');
      }

      // When the app loads, ask for token from opener
      window.opener.postMessage('ready-for-token', '*');

      // Fallback timeout to redirect if no response
      let timeout = setTimeout(() => {
        window.open('https://causalbench.org', '_self');
      }, 1000);
      
      // Listen for the token from parent
      window.addEventListener('message', event => {
        // Token received from parent window
        clearTimeout(timeout);

        // Ensure the message is from the expected origin
        if (event.origin !== 'https://causalbench.org' && event.origin !== 'https://www.causalbench.org') {
          window.open('https://causalbench.org', '_self');
        }

        // Obtain the token from the event data
        const token = event.data?.token;

        // Ensure that a token was received
        if (!token) {
          window.open('https://causalbench.org', '_self');
        }
        
        // Store the token
        this.setToken(token);
      });
    }
  }

  setToken(token: string) {
    sessionStorage.setItem('token', token);
    this.token$.next(token);
  }

  hasToken(): boolean {
    return sessionStorage.getItem('token') !== null;
  }

}
