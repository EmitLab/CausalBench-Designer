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
      // Check if the window has an opener
      if (!window.opener) {
        window.open('https://causalbench.org', '_self');
      }

      // When the app loads, ask for token from opener
      window.opener.postMessage('ready-for-token', 'https://causalbench.org');

      // Fallback timeout to redirect if no response
      let timeout = setTimeout(() => {
        window.open('https://causalbench.org', '_self');
        console.error('No token received from parent window within 1 second. Redirecting to CausalBench.');
      }, 1000);
      
      // Listen for the token from parent
      window.addEventListener('message', event => {
        console.log('Received message from parent window:');
        // Token received from parent window
        clearTimeout(timeout);

        // Ensure the message is from the expected origin
        if (event.origin !== 'https://causalbench.org') {
          window.open('https://causalbench.org', '_self');
        }

        // Obtain the token from the event data
        const token = event.data?.token;

        // Ensure that a token was received
        if (!token) {
          window.open('https://causalbench.org', '_self');
        }
        
        // Store the token
        sessionStorage.setItem('token', token);
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
