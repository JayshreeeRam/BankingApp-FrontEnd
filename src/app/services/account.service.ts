import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Account } from '../Models/Account';
import { CreateAccountDto } from '../DTOs/CreateAccountDto';
import { UpdateAccountDto } from '../DTOs/UpdateAccountDto';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  url: string = environment.backendURL+'Account';

  constructor(private http: HttpClient) {}

  getAllAccounts(): Observable<Account[]> {
    return this.http.get<Account[]>(this.url);
  }

  getAccountById(id: number): Observable<Account> {
    return this.http.get<Account>(`${this.url}/${id}`);
  }

  getAccountsByClientId(clientId: number): Observable<Account[]> {
    return this.http.get<Account[]>(`${this.url}/client/${clientId}`);
  }

  createAccount(accountDto: CreateAccountDto): Observable<Account> {
    return this.http.post<Account>(this.url, accountDto);
  }

  updateAccount(id: number, accountDto: UpdateAccountDto): Observable<Account> {
    return this.http.put<Account>(`${this.url}/${id}`, accountDto);
  }

  deleteAccount(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
