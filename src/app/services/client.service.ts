import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ClientDto } from '../DTOs/ClientDto'; // Adjust the import paths accordingly
import { CreateClientDto } from '../DTOs/CreateClientDto';
import { UpdateClientDto } from '../DTOs/UpdateClientDto';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private url: string = environment.backendURL+ "Client";

  constructor(private http: HttpClient) {}

  // Get all clients
  getAllClients(): Observable<ClientDto[]> {
    return this.http.get<ClientDto[]>(this.url);
  }

  // Get client by ID
  getClientById(id: number): Observable<ClientDto> {
    return this.http.get<ClientDto>(`${this.url}/${id}`);
  }

  // Create a new client
  createClient(dto: CreateClientDto): Observable<ClientDto> {
    return this.http.post<ClientDto>(this.url, dto);
  }

  // Update an existing client
  updateClient(id: number, dto: UpdateClientDto): Observable<ClientDto> {
    return this.http.put<ClientDto>(`${this.url}/${id}`, dto);
  }

  // Delete client by ID
  deleteClient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  approveClient(clientId: number): Observable<ClientDto> {
  return this.http.post<ClientDto>(`${this.url}/${clientId}/approve`, {});
}

}
