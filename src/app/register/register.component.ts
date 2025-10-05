import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environment/environment';
import { AuthService } from '../services/auth.service';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

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
  
  // Fix the TypeScript error by using type assertion or more specific typing
  isChecking: { [key: string]: boolean } = {
    username: false,
    email: false,
    phoneNumber: false
  };
  
  fieldErrors: { [key: string]: string } = {
    username: '',
    email: '',
    phoneNumber: ''
  };

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.registerForm = this.fb.group({
      username: ['', 
        [Validators.required, Validators.minLength(3)],
        [this.uniqueFieldValidator('username')]
      ],
      email: ['', 
        [Validators.required, Validators.email],
        [this.uniqueFieldValidator('email')]
      ],
      phoneNumber: ['', 
        [Validators.required, Validators.pattern(/^[0-9]{10}$/)],
        [this.uniqueFieldValidator('phoneNumber')]
      ],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    }, { validators: this.passwordsMatchValidator });

    // Real-time validation for duplicates
    this.setupRealTimeValidation();
  }

  // Custom async validator for unique fields
  private uniqueFieldValidator(fieldName: string) {
    return (control: AbstractControl) => {
      if (!control.value || control.invalid) {
        return of(null);
      }

      this.isChecking[fieldName] = true;
      this.fieldErrors[fieldName] = '';

      return this.http.get<any[]>(`${environment.backendURL}User`).pipe(
        debounceTime(500),
        switchMap(users => {
          this.isChecking[fieldName] = false;
          
          const existingUser = users.find(user => 
            user[fieldName]?.toLowerCase() === control.value.toLowerCase()
          );

          if (existingUser) {
            const errorMsg = this.getFieldErrorMessage(fieldName);
            this.fieldErrors[fieldName] = errorMsg;
            return of({ duplicate: true });
          }
          
          this.fieldErrors[fieldName] = '';
          return of(null);
        }),
        catchError(() => {
          this.isChecking[fieldName] = false;
          return of(null);
        })
      );
    };
  }

  // Setup real-time validation with debounce
  private setupRealTimeValidation() {
    // Username validation
    this.registerForm.get('username')?.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(() => {
        if (this.registerForm.get('username')?.valid) {
          this.registerForm.get('username')?.updateValueAndValidity();
        }
      });

    // Email validation
    this.registerForm.get('email')?.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(() => {
        if (this.registerForm.get('email')?.valid) {
          this.registerForm.get('email')?.updateValueAndValidity();
        }
      });

    // Phone number validation
    this.registerForm.get('phoneNumber')?.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(() => {
        if (this.registerForm.get('phoneNumber')?.valid) {
          this.registerForm.get('phoneNumber')?.updateValueAndValidity();
        }
      });
  }

  private getFieldErrorMessage(fieldName: string): string {
    const messages: { [key: string]: string } = {
      username: 'Username already exists',
      email: 'Email already exists',
      phoneNumber: 'Phone number already exists'
    };
    return messages[fieldName] || 'This value already exists';
  }

  passwordsMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirm = form.get('confirmPassword')?.value;
    return password === confirm ? null : { mismatch: true };
  }

  // Check if there are any duplicate errors
  hasDuplicateErrors(): boolean {
    return !!this.fieldErrors['username'] || !!this.fieldErrors['email'] || !!this.fieldErrors['phoneNumber'];
  }

  onSubmit() {
    if (this.registerForm.invalid || this.hasDuplicateErrors()) {
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
            this.storeUserData(username, userId, email, phoneNumber);
            this.navigateToClientForm(username, userId, email, phoneNumber);
          } else {
            this.getUserIdFromAPI(username, email, phoneNumber);
          }
        },
        error: (error) => {
          console.error('❌ Registration failed:', error);
          this.isLoading = false;
          this.errorMessage = this.getBackendErrorMessage(error);
        }
      });
  }

  private getBackendErrorMessage(error: any): string {
    const errorMessage = error.error?.message || 'Registration failed. Please try again.';
    
    // Map backend error messages to specific field errors
    if (errorMessage.includes('Username already exists')) {
      this.fieldErrors['username'] = errorMessage;
      this.registerForm.get('username')?.setErrors({ duplicate: true });
    } else if (errorMessage.includes('Email already exists')) {
      this.fieldErrors['email'] = errorMessage;
      this.registerForm.get('email')?.setErrors({ duplicate: true });
    } else if (errorMessage.includes('Phone number already exists')) {
      this.fieldErrors['phoneNumber'] = errorMessage;
      this.registerForm.get('phoneNumber')?.setErrors({ duplicate: true });
    }
    
    return errorMessage;
  }

  private getUserIdFromAPI(username: string, email: string, phoneNumber: string) {
    console.log('🔄 Falling back to API call to get user ID...');
    
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
    }, 500);
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

  // Clear field errors when user starts typing
  onFieldInput(fieldName: string) {
    this.fieldErrors[fieldName] = '';
    // Clear the duplicate error from form control
    if (this.registerForm.get(fieldName)?.hasError('duplicate')) {
      this.registerForm.get(fieldName)?.setErrors(null);
    }
  }

  get username() { return this.registerForm.get('username'); }
  get email() { return this.registerForm.get('email'); }
  get phoneNumber() { return this.registerForm.get('phoneNumber'); }
  get password() { return this.registerForm.get('password'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }
}