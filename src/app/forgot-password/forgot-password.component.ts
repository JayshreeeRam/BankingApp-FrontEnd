import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  stage: 'email' | 'otp' | 'reset' = 'email';

  email: string = '';
  otp: string = '';
  generatedOtp: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

   resendCooldown: number = 0; // countdown in seconds for resend OTP
  otpExpiryTimeout!: any;     // timeout handler for OTP expiry
  resendInterval!: any;    

  constructor(private router: Router) {}

  sendOtp() {
    if (!this.email) {
      alert('Please enter a valid email.');
      return;
    }

    console.log('Sending OTP to:', this.email);

    this.generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    alert(`OTP sent to ${this.email}: ${this.generatedOtp} (Mock)`);

    this.stage = 'otp';
  }

   startResendCooldown() {
    this.resendCooldown = 60; // cooldown period in seconds
    if (this.resendInterval) clearInterval(this.resendInterval);

    this.resendInterval = setInterval(() => {
      this.resendCooldown--;
      if (this.resendCooldown <= 0) {
        clearInterval(this.resendInterval);
      }
    }, 1000);
  }

  startOtpExpiryTimer() {
    if (this.otpExpiryTimeout) clearTimeout(this.otpExpiryTimeout);

    this.otpExpiryTimeout = setTimeout(() => {
      this.generatedOtp = '';
      alert('OTP expired. Please request a new one.');
      this.stage = 'email';
    }, 5 * 60 * 1000); // OTP expires in 5 minutes (300000 ms)
  }

  resendOtp() {
    if (this.resendCooldown > 0) return; // disable if cooldown active

    this.sendOtp(); // send OTP again, resets timers
  }

   verifyOtp() {
    if (!this.generatedOtp) {
      alert('OTP expired, please request a new one.');
      this.stage = 'email';
      return;
    }

    if (this.otp === this.generatedOtp) {
      clearTimeout(this.otpExpiryTimeout);
      this.stage = 'reset';
    } else {
      alert('Invalid OTP');
    }
  }


  resetPassword() {
    if (this.newPassword !== this.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    alert('Password reset successful! (Mock)');
    this.router.navigate(['/login']);
  }
}
