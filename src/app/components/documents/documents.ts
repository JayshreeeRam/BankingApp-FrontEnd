import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocumentService } from '../../services/document.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.html',
  imports: [CommonModule],
  styleUrls: ['./documents.css']
})
export class Documents implements OnInit {
  documents: any[] = [];  
  id: string | null = null;
  activeTab: string = ''; 

  constructor(
    private route: ActivatedRoute,
    private documentSvc: DocumentService,
    private cdRef: ChangeDetectorRef  
  ) { }

  ngOnInit(): void {
   
    
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');  
      console.log('Document ID:', this.id);  

      
      if (this.id) {
        this.fetchDocuments(this.id);
      }
    });
  }

  searchClientId: number | null = null;

fetchDocumentsByClientId(): void {
  if (this.searchClientId) {
    this.fetchDocuments(this.searchClientId.toString());
  }
}

clearSearch(): void {
  this.searchClientId = null;
  
  this.documents = []; 
}

  
  fetchDocuments(id: string | null): void {
    if (id) {
      this.documentSvc.getAllDocuments().subscribe(
        (data) => {
          console.log(data);
          
          this.documents = data.filter(d => d.uploadedByUserId === Number(id));
          
          
          this.cdRef.detectChanges();
        },
        (error) => {
          
          console.error('Error fetching documents:', error);
        }
      );
    }
  }

















  
  downloadDocument(path: any, name: any): void {
    console.log('Downloading document:', name);
    
  }
}
