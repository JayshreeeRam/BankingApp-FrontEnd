import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SalaryDisbursementDto } from '../DTOs/SalaryDisbursementDto'; // Adjust the path as needed
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class SalaryDisbursementService {
  private url: string = environment.backendURL+"SalaryDisbursement";

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

  // Approve all salaries in a batch
  approveSalaryByBatch(batchId: number): Observable<SalaryDisbursementDto[]> {
    return this.http.post<SalaryDisbursementDto[]>(`${this.url}/approveBatch/${batchId}`, {});
  }

  getPending(): Observable<any[]> {
  return this.http.get<any[]>(`${this.url}/pending`);
}
rejectSalary(id: number) {
  return this.http.post(`${this.url}//SalaryDisbursement/reject/${id}`, {});
}
updateSalaryDisbursement(id: number, salaryData: any) {
  return this.http.put(`/api/SalaryDisbursement/${id}`, salaryData);
}


}
