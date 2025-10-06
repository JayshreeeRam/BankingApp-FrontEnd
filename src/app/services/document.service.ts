import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';
import { Document } from '../Models/Document';
import { DocumentDto } from '../DTOs/DocumentDto';
import { DocumentStatus } from '../Enum/DocumentStatus 1';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  url: string = environment.backendURL + "Document";

  constructor(private http: HttpClient) { }

  // Fetch all documents
  getAllDocuments(): Observable<DocumentDto[]> {
    return this.http.get<DocumentDto[]>(this.url);
  }

  // Upload a document (Cloudinary handled in backend)
  uploadDocument(formData: FormData): Observable<any> {
    return this.http.post(`${this.url}/upload`, formData);
  }
  // DocumentService
  downloadFile(fileUrl: string) {
    return this.http.get(fileUrl, { responseType: 'blob' }); // fetch as binary
  }
  updateDocumentStatus(documentId: number, status: DocumentStatus): Observable<DocumentDto> {
    return this.http.put<DocumentDto>(`${this.url}/${documentId}/status`, { status });
  }


}

