import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BeneficiaryDto } from '../DTOs/Beneficiary.dto'; // Adjust paths as needed
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class BeneficiaryService {
  private url: string = environment.backendURL+ "Beneficiary";

  constructor(private http: HttpClient) {}

  // Get all beneficiaries
  getAllBeneficiaries(): Observable<BeneficiaryDto[]> {
    return this.http.get<BeneficiaryDto[]>(this.url);
  }

  // Get beneficiary by ID
  getBeneficiaryById(id: number): Observable<BeneficiaryDto> {
    return this.http.get<BeneficiaryDto>(`${this.url}/${id}`);
  }

  // Create a new beneficiary
  createBeneficiary(dto: BeneficiaryDto): Observable<BeneficiaryDto> {
    return this.http.post<BeneficiaryDto>(this.url, dto);
  }

  // Update beneficiary by ID
  updateBeneficiary(id: number, dto: BeneficiaryDto): Observable<BeneficiaryDto> {
    return this.http.put<BeneficiaryDto>(`${this.url}/${id}`, dto);
  }

  // Delete beneficiary by ID
  deleteBeneficiary(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
