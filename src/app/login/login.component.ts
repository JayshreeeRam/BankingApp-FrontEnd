import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

// Import AuthService and LoginDto
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../DTOs/login.dto';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  captchaText: string = '';
  roles = ['user', 'admin', 'superadmin'];

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      captcha: ['', Validators.required],
      role: ['user', Validators.required],
    });

    this.generateCaptcha();
  }

  generateCaptcha() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    this.captchaText = '';
    for (let i = 0; i < 5; i++) {
      this.captchaText += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  }

  submit() {
    if (this.form.valid) {
      if (this.form.value.captcha?.toUpperCase() === this.captchaText) {
        const loginData: LoginDto = {
          username: this.form.value.username,
          password: this.form.value.password,
        };

        // Call the login method of the AuthService
        this.authService.login(loginData).subscribe({
          next: (res) => {
            // Save the token and user info to localStorage
            console.log(res);
            this.authService.saveToken(res);

            alert(`Login successful! as ${this.form.value.role}!`);
            // Navigate based on the user's role
            switch (this.form.value.role) {
              case 'user':
                this.router.navigate(['/dashboard/user']);
                break;
              case 'admin':
                this.router.navigate(['/dashboard/admin']);
                break;
              case 'superadmin':
                this.router.navigate(['/dashboard/superadmin']);
                break;
            }
          },
          error: (err) => {
            alert('Login failed: ' + (err.error?.message || 'Unknown error'));
            this.generateCaptcha(); // regenerate captcha on failure
          },
        });
      } else {
        alert('Invalid captcha. Please try again.');
        this.generateCaptcha(); // regenerate captcha
      }
    } else {
      alert('Please fill in all fields.');
    }
  }
}
