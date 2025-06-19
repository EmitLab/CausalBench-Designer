import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private token: string = '';

  constructor() {
    this.loadTokenFromFile();
  }

  private loadTokenFromFile() {
    // For web applications, we can't directly read files from the desktop
    // We'll provide a way to manually input the token or use localStorage
    this.token = sessionStorage.getItem('auth_token') || '';
    
    if (!this.token) {
      // Prompt user to input token if not found
      this.promptForToken();
    }
  }

  private promptForToken() {
    const token = prompt('Please enter your authorization token:');
    if (token) {
      this.token = token;
      sessionStorage.setItem('auth_token', token);
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