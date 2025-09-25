import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserDto } from '../DTOs/UserDto'; // Adjust the import path as needed

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url: string = "http://localhost:5147/api/User";

  constructor(private http: HttpClient) {}

  // Get all users
  getAllUsers(): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(this.url);
  }

  // Get user by ID
  getUserById(id: number): Observable<UserDto> {
    return this.http.get<UserDto>(`${this.url}/${id}`);
  }

  // Add a new user
  addUser(dto: UserDto): Observable<UserDto> {
    return this.http.post<UserDto>(this.url, dto);
  }

  // Update an existing user
  updateUser(id: number, dto: UserDto): Observable<UserDto> {
    return this.http.put<UserDto>(`${this.url}/${id}`, dto);
  }

  // Delete user by ID
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
