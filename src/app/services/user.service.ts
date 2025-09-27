import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserDto } from '../DTOs/UserDto';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url: string = environment.backendURL + "User";

  constructor(private http: HttpClient) {}

  // ✅ Current logged-in user profile
getProfile(userId: number): Observable<UserDto> {
  return this.http.get<UserDto>(`${this.url}/${userId}`);
}

updateProfile(userId: number, dto: UserDto): Observable<UserDto> {
  return this.http.put<UserDto>(`${this.url}/${userId}`, dto);
}


  // Other admin-level endpoints if needed
  getAllUsers(): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(this.url);
  }

  getUserById(id: number): Observable<UserDto> {
    return this.http.get<UserDto>(`${this.url}/${id}`);
  }

  addUser(dto: UserDto): Observable<UserDto> {
    return this.http.post<UserDto>(this.url, dto);
  }

  updateUser(id: number, dto: UserDto): Observable<UserDto> {
    return this.http.put<UserDto>(`${this.url}/${id}`, dto);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
