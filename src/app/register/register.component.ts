import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environment/environment';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,  
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    }, { validators: this.passwordsMatchValidator });
  }

  passwordsMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirm = form.get('confirmPassword')?.value;
    return password === confirm ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const { username, email, phoneNumber, password } = this.registerForm.value;

    const registerData = {
      username: username,
      password: password,
      email: email,
      phoneNumber: phoneNumber,
      userRole: "User"
    };

    console.log('🔄 Registering user with data:', registerData);

    this.http.post<any>(environment.backendURL + 'Auth/register', registerData)
      .subscribe({
        next: (response) => {
          console.log('✅ Registration successful:', response);
          
          // Save token to localStorage
          this.authService.saveToken(response);
          
          // Extract user ID from the token using your existing function
          const userId = this.authService.getUserIdFromToken();
          
          console.log('🔍 User ID extracted from token:', userId);
          
          if (userId && userId > 0) {
            // Success! We have the user ID
            this.storeUserData(username, userId, email, phoneNumber);
            this.navigateToClientForm(username, userId, email, phoneNumber);
          } else {
            // Fallback: Try to get user ID from API
            this.getUserIdFromAPI(username, email, phoneNumber);
          }
        },
        error: (error) => {
          console.error('❌ Registration failed:', error);
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
        }
      });
  }

  private getUserIdFromAPI(username: string, email: string, phoneNumber: string) {
    console.log('🔄 Falling back to API call to get user ID...');
    
    // Wait a moment for database to update, then fetch the user
    setTimeout(() => {
      this.http.get<any[]>(environment.backendURL + 'User').subscribe({
        next: (users) => {
          const user = users.find(u => u.username === username);
          
          if (user && user.userId) {
            console.log('✅ Found user via API:', user);
            this.storeUserData(username, user.userId, email, phoneNumber);
            this.navigateToClientForm(username, user.userId, email, phoneNumber);
          } else {
            console.warn('⚠️ User not found in API, navigating without user ID');
            this.storeUserData(username, 0, email, phoneNumber);
            this.navigateToClientForm(username, 0, email, phoneNumber);
          }
        },
        error: (error) => {
          console.error('❌ Error fetching users:', error);
          console.warn('⚠️ API call failed, navigating without user ID');
          this.storeUserData(username, 0, email, phoneNumber);
          this.navigateToClientForm(username, 0, email, phoneNumber);
        }
      });
    }, 500); // Wait 0.5 seconds for database
  }

  private storeUserData(username: string, userId: number, email: string, phoneNumber: string) {
    localStorage.setItem('temp_username', username);
    localStorage.setItem('temp_name', username);
    localStorage.setItem('temp_userId', userId.toString());
    localStorage.setItem('temp_email', email);
    localStorage.setItem('temp_phoneNumber', phoneNumber);
    console.log('💾 Stored user data - UserId:', userId);
  }

  private navigateToClientForm(username: string, userId: number, email: string, phoneNumber: string) {
    console.log('🚀 Navigating to client form with UserId:', userId);
    
    this.router.navigate(['/clients'], { 
      queryParams: { 
        username: username,
        userId: userId,
        email: email,
        phoneNumber: phoneNumber
      } 
    });
  }

  private markFormGroupTouched() {
    Object.keys(this.registerForm.controls).forEach(key => {
      this.registerForm.get(key)?.markAsTouched();
    });
  }

  get username() { return this.registerForm.get('username'); }
  get email() { return this.registerForm.get('email'); }
  get phoneNumber() { return this.registerForm.get('phoneNumber'); }
  get password() { return this.registerForm.get('password'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }
}