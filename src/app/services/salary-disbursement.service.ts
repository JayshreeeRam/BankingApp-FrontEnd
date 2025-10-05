import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SalaryDisbursementDto } from '../DTOs/SalaryDisbursementDto';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class SalaryDisbursementService {
  private url: string = environment.backendURL + "SalaryDisbursement";

  constructor(private http: HttpClient) {}

  // Get all salary disbursements
  getAllSalaryDisbursements(): Observable<SalaryDisbursementDto[]> {
    return this.http.get<SalaryDisbursementDto[]>(this.url);
  }

  // Get salary disbursement by ID
  getSalaryDisbursementById(id: number): Observable<SalaryDisbursementDto> {
    return this.http.get<SalaryDisbursementDto>(`${this.url}/${id}`);
  }

  // Add a new salary disbursement
  addSalaryDisbursement(dto: SalaryDisbursementDto): Observable<SalaryDisbursementDto> {
    return this.http.post<SalaryDisbursementDto>(this.url, dto);
  }

  // Approve salary by ID
  approveSalary(id: number): Observable<SalaryDisbursementDto> {
    return this.http.post<SalaryDisbursementDto>(`${this.url}/approve/${id}`, {});
  }

  // Approve all salaries in a department (batch = department name now)
  approveSalaryByBatch(department: string): Observable<any> {
    return this.http.post(`${this.url}/approveBatch/${department}`, {});
  }

  // Get all pending
  getPending(): Observable<SalaryDisbursementDto[]> {
    return this.http.get<SalaryDisbursementDto[]>(`${this.url}/pending`);
  }

  // Reject salary
  rejectSalary(id: number): Observable<any> {
    return this.http.post(`${this.url}/reject/${id}`, {});
  }

  // Update salary disbursement
  updateSalaryDisbursement(id: number, salaryData: any): Observable<any> {
    return this.http.put(`${this.url}/${id}`, salaryData);
  }
}
