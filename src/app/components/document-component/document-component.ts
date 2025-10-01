import { Component } from '@angular/core';
import { DocumentService } from '../../services/document.service';
import { UserService } from '../../services/user.service';
import { DocumentDto } from '../../DTOs/DocumentDto';
import { DocumentStatus } from '../../Enum/DocumentStatus 1';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule,DatePipe,FormsModule],
  templateUrl: './document-component.html',
  styleUrls: ['./document-component.css']
})
export class DocumentsComponent {
   activeTab: string = 'documents'; 
  DocumentStatus = DocumentStatus;
  searchUserId: number | null = null;
  documents: DocumentDto[] = [];
  searchDone = false;

  constructor(
    private docSvc: DocumentService,
    private userSvc: UserService
  ) {}

  fetchDocumentsByUser() {
    if (!this.searchUserId) {
      alert("Please enter a user ID.");
      return;
    }

    this.userSvc.getUserById(this.searchUserId).subscribe({
      next: (user: any) => {
        if (user && user.documents && user.documents.length > 0) {
          this.documents = user.documents;
          console.log("Fetched documents:", this.documents);
        } else {
          this.documents = [];
          alert("This user has no documents.");
        }
        this.searchDone = true;
      },
      error: (err: any) => {
        console.error('Error fetching user or documents:', err);
        this.documents = [];
        this.searchDone = true;
      }
    });
  }


 

viewDocument(doc: DocumentDto) {
  if (!doc.filePath || doc.filePath === 'string') {
    alert('No file available for viewing.');
    return;
  }
  console.log('Opening file path:', doc.filePath);

  window.open(doc.filePath, '_blank');
}

downloadDocument(doc: DocumentDto) {
  if (!doc.filePath || doc.filePath === 'string') {
    alert('No file available for download.');
    return;
  }

  const link = document.createElement('a');
  link.href = doc.filePath;
  link.download = doc.fileName || 'document';
  link.target = '_blank';
  link.click();
}


}
