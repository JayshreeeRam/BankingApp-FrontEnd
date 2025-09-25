import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TransactionDto } from '../DTOs/TransactionDto'; // Adjust the import path as needed

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private url: string = "http://localhost:5147/api/Transaction";

  constructor(private http: HttpClient) {}

  // Get all transactions
  getAllTransactions(): Observable<TransactionDto[]> {
    return this.http.get<TransactionDto[]>(this.url);
  }

  // Get transaction by ID
  getTransactionById(id: number): Observable<TransactionDto> {
    return this.http.get<TransactionDto>(`${this.url}/${id}`);
  }

  // Get transactions by account ID
  getTransactionsByAccount(accountId: number): Observable<TransactionDto[]> {
    return this.http.get<TransactionDto[]>(`${this.url}/account/${accountId}`);
  }

  // Add a new transaction
  addTransaction(dto: TransactionDto): Observable<TransactionDto> {
    return this.http.post<TransactionDto>(this.url, dto);
  }

  // Update an existing transaction
  updateTransaction(id: number, dto: TransactionDto): Observable<TransactionDto> {
    return this.http.put<TransactionDto>(`${this.url}/${id}`, dto);
  }

  // Delete transaction by ID
  deleteTransaction(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
