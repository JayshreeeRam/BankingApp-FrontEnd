import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private documents: { type: string; fileName: string; url: string }[] = [];

  url:string = "http://localhost:5147/api" + "/Document";

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
