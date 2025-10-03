import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginDto } from '../DTOs/login.dto';
import { LoginResponseDTO } from '../DTOs/login-response.dto';  // import the new LoginResponseDTO
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl =  environment.backendURL+'Auth';

  constructor(private http: HttpClient) {}

  getUserIdFromToken(): number | null {
  const token = this.getToken();
  if (!token) return null;

  try {
    const payloadBase64 = token.split('.')[1];
    const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
    const decodedPayload = JSON.parse(atob(base64));
    
    // Adjust the claim key as per your token payload (example below)
    return Number(decodedPayload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']);
  } catch (error) {
    console.error('Error decoding token to get userId', error);
    return null;
  }
}

  // Adjust the login method to expect LoginDto and return LoginResponseDTO
  login(credentials: LoginDto): Observable<LoginResponseDTO> {
    return this.http.post<LoginResponseDTO>(`${this.baseUrl}/login`, credentials);
  }

  // Save token and user data to localStorage
  // In your auth.service.ts
saveToken(response: any): void {
  try {
    if (!response) {
      throw new Error("Invalid token or user data");
    }

    console.log('💾 Saving token and user data:', response);

    // Save token and user data - make sure token is saved as 'token'
    localStorage.setItem("token", response.token); // This should be 'token'
    localStorage.setItem("role", response.role);
    localStorage.setItem("user", response.username);

    console.log('✅ Token saved successfully as "token" in localStorage');
    
    // Verify it was saved
    console.log('🔍 Verification - token in localStorage:', localStorage.getItem('token'));
  } catch (err) {
    console.error("❌ Error saving token or decoding JWT", err);
  }
}
  // Utility function to get the token from localStorage
  getToken(): string | null {
    return localStorage.getItem("token");
  }

  // Utility function to get the role from localStorage
  getRole(): string | null {
    return localStorage.getItem("role");
  }

  // Utility function to check if the user is logged in
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Clear the token and user data from localStorage when logging out
  logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
  }
}