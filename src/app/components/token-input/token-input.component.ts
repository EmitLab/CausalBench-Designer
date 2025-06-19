import { Component } from '@angular/core';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-token-input',
  template: `
    <div class="token-input-container" *ngIf="!tokenService.hasToken()">
      <div class="token-input-box">
        <h3>Authorization Required</h3>
        <p>Please enter your authorization token to access the API:</p>
        <input 
          type="password" 
          [(ngModel)]="tokenInput" 
          placeholder="Enter your token here"
          class="token-input-field"
          (keyup.enter)="setToken()">
        <button (click)="setToken()" class="btn btn-primary">Set Token</button>
        <p class="token-help">
          <strong>How to get your token:</strong><br>
          1. Create a text file on your desktop named "auth_token.txt"<br>
          2. Put your authorization token in that file<br>
          3. Copy and paste the token here, or enter it manually
        </p>
      </div>
    </div>
  `,
  styles: [`
    .token-input-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
    }
    
    .token-input-box {
      background-color: white;
      padding: 30px;
      border-radius: 8px;
      max-width: 500px;
      text-align: center;
    }
    
    .token-input-field {
      width: 100%;
      padding: 12px;
      margin: 15px 0;
      border: 2px solid #ddd;
      border-radius: 4px;
      font-size: 16px;
    }
    
    .token-help {
      font-size: 12px;
      color: #666;
      text-align: left;
      margin-top: 15px;
      line-height: 1.4;
    }
  `]
})
export class TokenInputComponent {
  tokenInput: string = '';

  constructor(public tokenService: TokenService) {}

  setToken() {
    if (this.tokenInput.trim()) {
      this.tokenService.setToken(this.tokenInput.trim());
    }
  }
} 