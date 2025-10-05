import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ClientService } from '../../services/client.service';
import { UserDto } from '../../DTOs/UserDto';
import { ClientDto } from '../../DTOs/ClientDto';
import { DocumentDto } from '../../DTOs/DocumentDto';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './document-component.html',
  styleUrls: ['./document-component.css']
})
export class DocumentsComponent implements OnInit {
  activeTab: string = 'documents';
  searchAccountNo: string = '';
  users: UserDto[] = [];
  clients: ClientDto[] = [];
  filteredDocuments: DocumentDto[] = [];
  searchSubject = new Subject<string>();
  

  constructor(
    private userSvc: UserService,
    private clientSvc: ClientService
  ) {}

  ngOnInit() {
    // Load all users
    this.userSvc.getAllUsers().subscribe({
      next: (users: UserDto[] | undefined) => this.users = users || [],
      error: err => console.error('Error loading users:', err)
    });

    // Load all clients
    this.clientSvc.getAllClients().subscribe({
      next: (clients: ClientDto[] | undefined) => this.clients = clients || [],
      error: err => console.error('Error loading clients:', err)
    });

    // Live search debounce
    this.searchSubject.pipe(debounceTime(300))
      .subscribe(accountNo => this.searchByAccount(accountNo));
  }

  onSearchAccountChange() {
    this.searchSubject.next(this.searchAccountNo);
  }

  searchByAccount(accountNo: string) {
    if (!accountNo.trim()) {
      this.filteredDocuments = [];
      return;
    }

    // Find clients with matching account numbers
    const matchedClients = this.clients.filter(c =>
      c.accountNo.toLowerCase().includes(accountNo.toLowerCase())
    );

    this.filteredDocuments = this.filteredDocuments.map(doc => {
  const user = this.users.find(u => u.userId === doc.uploadedByUserId);
  return {
    ...doc,
    uploadedByUsername: user ? user.username : 'Unknown'
  };
});
   

    this.filteredDocuments = [];

matchedClients.forEach(client => {
  const clientUser = this.users.find(u => u.userId === client.userId);

  if (clientUser?.documents?.length) {
    this.filteredDocuments.push(
      ...clientUser.documents.map(d => {
        const uploader = this.users.find(u => u.userId === d.uploadedByUserId);
        return {
          ...d,
          clientName: client.name,
          accountNumber: client.accountNo,
          uploadedByUsername: uploader ? uploader.username : 'Unknown'
        };
      })
    );
  }
});
}

  viewDocument(doc: DocumentDto) {
    if (!doc.filePath || doc.filePath === 'string') {
      alert('No file available for viewing.');
      return;
    }
    window.open(doc.filePath, '_blank');
  }

  downloadDocument(doc: DocumentDto) {
  if (!doc.filePath || doc.filePath === 'string') {
    alert('No file available for download.');
    return;
  }

  fetch(doc.filePath)
    .then(res => res.blob())
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.fileName || 'document';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    })
    .catch(err => {
      console.error('Download failed', err);
      alert('Failed to download file.');
    });
}

}
