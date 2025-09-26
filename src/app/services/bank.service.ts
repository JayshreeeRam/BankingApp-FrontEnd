import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BankDto } from '../DTOs/Bank.dto';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class BankService {
  private url: string = environment.backendURL+'Bank';

  constructor(private http: HttpClient) {}

  getAll(): Observable<BankDto[]> {
    return this.http.get<BankDto[]>(this.url);
  }

  getById(id: number): Observable<BankDto> {
    return this.http.get<BankDto>(`${this.url}/${id}`);
  }

  create(bank: BankDto): Observable<BankDto> {
    return this.http.post<BankDto>(this.url, bank);
  }

  update(id: number, bank: BankDto): Observable<BankDto> {
    return this.http.put<BankDto>(`${this.url}/${id}`, bank);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
