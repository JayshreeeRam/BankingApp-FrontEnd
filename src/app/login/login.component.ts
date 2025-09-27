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

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) { }

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
        role: this.form.value.role
      };

      this.authService.login(loginData).subscribe({
        next: (res) => {
          console.log('Login response:', res);

          if (!res.token) {
            alert('Token not received from server!');
            this.generateCaptcha();
            return;
          }

          this.authService.saveToken(res);

          // Use role directly from the response (not res.user.role)
          alert(`Login successful! as ${res.role}!`);

          switch (res.role.toLowerCase()) {
            case 'user':
              this.router.navigate(['/dashboard/user']);
              break;
            case 'admin':
              this.router.navigate(['/dashboard/admin']);
              break;
            case 'superadmin':
              this.router.navigate(['/dashboard/superadmin']);
              break;
            default:
              this.router.navigate(['/login']);
              break;
          }
        },
        error: (err) => {
          alert('Login failed: ' + (err.error?.message || 'Unknown error'));
          this.generateCaptcha();
        },
      });
    } else {
      alert('Invalid captcha. Please try again.');
      this.generateCaptcha();
    }
  } else {
    alert('Please fill in all fields.');
  }
}

}
