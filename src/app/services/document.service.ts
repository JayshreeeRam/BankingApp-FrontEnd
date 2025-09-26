import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private documents: { type: string; fileName: string; url: string }[] = [];

  url:string = environment.backendURL+ "/Document";

  constructor(private http:HttpClient){}

  addDocument(doc: { type: string; fileName: string; url: string }) {
    this.documents.push(doc);
  }

  getDocuments() {
    return this.documents;
  }

  clearDocuments() {
    this.documents = [];
  }

  getAllDocuments():Observable<Document[]>{
    return this.http.get<Document[]>(this.url)
  }


}
