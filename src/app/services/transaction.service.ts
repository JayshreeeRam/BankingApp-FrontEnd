import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TransactionDto } from '../DTOs/TransactionDto';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private url: string = environment.backendURL + "Transaction";

  constructor(private http: HttpClient) {}

  // ✅ Get current user's transactions

// Pass receiverId (userId) to get transactions where user is the receiver
getTransactionsByUserId(userId: number): Observable<TransactionDto[]> {
  return this.http.get<TransactionDto[]>(`${this.url}/user/${userId}`);
}


  getAllTransactions(): Observable<TransactionDto[]> {
    return this.http.get<TransactionDto[]>(this.url);
  }

  getTransactionById(id: number): Observable<TransactionDto> {
    return this.http.get<TransactionDto>(`${this.url}/${id}`);
  }

  getTransactionsByAccount(accountId: number): Observable<TransactionDto[]> {
    return this.http.get<TransactionDto[]>(`${this.url}/account/${accountId}`);
  }

  addTransaction(dto: TransactionDto): Observable<TransactionDto> {
    return this.http.post<TransactionDto>(this.url, dto);
  }

  updateTransaction(id: number, dto: TransactionDto): Observable<TransactionDto> {
    return this.http.put<TransactionDto>(`${this.url}/${id}`, dto);
  }

  deleteTransaction(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
