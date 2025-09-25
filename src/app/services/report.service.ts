import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ReportDto } from '../DTOs/ReportDto'; // Adjust the import path as needed

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private url: string = "http://localhost:5147/api/Report";

  constructor(private http: HttpClient) {}

  // Get all reports
  getAllReports(): Observable<ReportDto[]> {
    return this.http.get<ReportDto[]>(this.url);
  }

  // Get report by ID
  getReportById(id: number): Observable<ReportDto> {
    return this.http.get<ReportDto>(`${this.url}/${id}`);
  }

  // Add a new report
  addReport(dto: ReportDto): Observable<ReportDto> {
    return this.http.post<ReportDto>(this.url, dto);
  }

  // Update an existing report
  updateReport(id: number, dto: ReportDto): Observable<ReportDto> {
    return this.http.put<ReportDto>(`${this.url}/${id}`, dto);
  }

  // Delete report by ID
  deleteReport(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
