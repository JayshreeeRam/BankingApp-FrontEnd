import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginDto } from '../DTOs/login.dto';
import { LoginResponseDTO } from '../DTOs/login-response.dto';  // import the new LoginResponseDTO

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:5147/api/Auth';

  constructor(private http: HttpClient) {}

  // Adjust the login method to expect LoginDto and return LoginResponseDTO
  login(credentials: LoginDto): Observable<LoginResponseDTO> {
    return this.http.post<LoginResponseDTO>(`${this.baseUrl}/login`, credentials);
  }

  // Save token and user data to localStorage
  saveToken(response:any): void {
    try {
      if (!response) {
        throw new Error("Invalid token or user data");
      }

      console.log(response);

      // Save token and user data
      localStorage.setItem("token", response.token);
      localStorage.setItem("role", response.role);
      localStorage.setItem("user", response.username);

      // Decode JWT token to extract the role
      const payloadBase64 = response.token.split('.')[1];
      const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
      const decodedPayload = JSON.parse(atob(base64));

      // Store the role in localStorage
      // localStorage.setItem("role", decodedPayload["role"]);
    } catch (err) {
      console.error("Error saving token or decoding JWT", err);
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
