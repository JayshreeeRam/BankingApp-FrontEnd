import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaymentDto } from '../DTOs/PaymentDto'; // Adjust the path as needed
import { CreatePaymentDto } from '../DTOs/CreatePaymentDto';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private url: string = "http://localhost:5147/api/Payment";

  constructor(private http: HttpClient) {}

  // Get all payments
  getAllPayments(): Observable<PaymentDto[]> {
    return this.http.get<PaymentDto[]>(this.url);
  }

  // Get payment by ID
  getPaymentById(id: number): Observable<PaymentDto> {
    return this.http.get<PaymentDto>(`${this.url}/${id}`);
  }

  // Add a new payment
  addPayment(dto: CreatePaymentDto): Observable<PaymentDto> {
    return this.http.post<PaymentDto>(this.url, dto);
  }

  // Delete payment by ID
  deletePayment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  // Approve payment by ID
  approvePayment(id: number): Observable<PaymentDto> {
    return this.http.post<PaymentDto>(`${this.url}/${id}/approve`, {});
  }
}
