import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocumentService } from '../../services/document.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.html',
  imports:[CommonModule],
  styleUrls: ['./documents.css']  // Fixed typo: it should be "styleUrls" (plural)
})
export class Documents implements OnInit {
  documents: any[] = [];  // Initialize as an empty array
  id: string | null = null;
  activeTab: string = ''; // Add this property to fix the error

  constructor(private route: ActivatedRoute, private documentSvc: DocumentService) { }

  ngOnInit(): void {
   
    // Subscribe to route parameters to get the 'id'
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');  // Get the 'id' from the route params
      console.log('Document ID:', this.id);  // Log the id or use it in your logic

      // Only fetch documents if id is not null
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
  // Reload all documents or clear the current list
  this.documents = []; // or reload all documents if you want to show everything
}

  // Fetch documents based on the 'id'
  // Add this method to your component
viewClientDocuments(clientId: number): void {
  this.fetchDocuments(clientId.toString());
  this.activeTab = 'documents'; // Switch to documents tab to show the results
}

// Update your existing fetchDocuments method
fetchDocuments(id: string | null): void {
  if (id) {
    this.documentSvc.getAllDocuments().subscribe(
      (data) => {
        console.log(data);
        // Filter documents based on uploadedByUserId
        this.documents = data.filter(d => d.uploadedByUserId === Number(id));
      },
      (error) => {
        // Handle error (you could show a message to the user)
        console.error('Error fetching documents:', error);
      }
    );
  }
}
  // Method to download document
  downloadDocument(path: any, name: any): void {
    console.log('Downloading document:', name);
    // Add your download logic here, e.g., triggering a download action
  }
}
