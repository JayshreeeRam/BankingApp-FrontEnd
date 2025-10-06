import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EmployeeDto } from '../DTOs/EmployeeDto'; // Adjust the import path as needed
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private url: string = environment.backendURL + "Employee";

  constructor(private http: HttpClient) {}

  // Get all employees
  getAllEmployees() {
    const token = localStorage.getItem('jwtToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(this.url, { headers });
  }

  // Get employee by ID
  getEmployeeById(id: number): Observable<EmployeeDto> {
    return this.http.get<EmployeeDto>(`${this.url}/${id}`);
  }

  // Add a new employee
  addEmployee(dto: EmployeeDto): Observable<EmployeeDto> {
    return this.http.post<EmployeeDto>(this.url, dto);
  }

  // Update an existing employee
  updateEmployee(id: number, dto: EmployeeDto): Observable<EmployeeDto> {
    return this.http.put<EmployeeDto>(`${this.url}/${id}`, dto);
  }

  // Delete employee by ID
  deleteEmployee(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  // Upload employees from CSV file
  uploadEmployees(file: File, senderClientId: number): Observable<any> {
    const token = localStorage.getItem('jwtToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // Create FormData to send the file
    const formData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post<any>(
      `${this.url}/upload/${senderClientId}`, 
      formData, 
      { headers }
    );
  }
}