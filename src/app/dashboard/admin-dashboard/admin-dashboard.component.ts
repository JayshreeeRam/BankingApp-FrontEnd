import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
// Safe URL Pipe
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Pipe, PipeTransform } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { ClientDto } from '../../DTOs/ClientDto';
import { PaymentService } from '../../services/payment.service';

@Pipe({ name: 'safeUrl' })
export class SafeUrlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
interface Client {
  clientId: number;
  name: string;
  accountNo: string;
  bankName: string;
  verificationStatus: string;
}

interface Document {
  documentType: string;
  status: string;
  filePath: string;
}

interface Payment {
  paymentId: number;
  clientName: string;
  beneficiaryName: string;
  amount: number;
  paymentDate: Date;
  paymentStatus: string;
}

interface Report {
  reportId: number;
  reportType: string;
  generatedDate: Date;
  filePath?: string;
}

interface User {
  userId: number;
  name: string;
  email: string;
  role: string;
}
interface Document {
  documentType: string;
  status: string;
  filePath: string;
}

interface User {
  userId: number;
  name: string;
  email: string;
  role: string;
  accountNumber?: string;
  clientName?: string;
  transactionId?: string;
  beneficiaryId?: string;
  documents?: Document[];
  
}

interface DocumentItem {
  documentId: number;
  uploadedByUsername: string;
  documentType: string;
  documentStatus: string;
  uploadDate: Date;
  fileName: string;
  filePath?:string;
}


@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule,SafeUrlPipe],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  activeTab: string = 'clients';
  userDocuments = [
    { id: 1, userName: 'John Doe', fileUrl: 'https://example.com/sample.pdf' },
    { id: 2, userName: 'Jane Smith', fileUrl: 'https://example.com/sample-image.jpg' }
  ];
expandedUserIndex: number | null = null;
  selectedDocumentUrl: string | null = null;
  showModal: boolean = false;
constructor(private router:Router,private clientsvc:ClientService,private paymentService:PaymentService){}
  clients: any[] = [];

  ngOnInit(): void {
    this.getAllPayments();
  }

  getAllClients(event: Event) {
  event.preventDefault();
  this.clientsvc.getAllClients().subscribe(
    (data) => {
      this.clients = data;
      console.log(this.clients);
    },
    (error) => {
      console.error(error);
    }
  );
}
  

  payments: any[] = [];
  getAllPayments() {
    this.paymentService.getAllPayments().subscribe(
      (data) => {
        this.payments = data;
        console.log(this.payments);
      },
      (error) => {
        console.error(error);
      }
    );
  }


  reportTypes = ['Daily Transactions', 'Client Activity', 'Payment Summary'];
  selectedReportType: string = this.reportTypes[0];

  reports: Report[] = [
    { reportId: 1, reportType: 'Daily Transactions', generatedDate: new Date(), filePath: 'reports/daily-transactions-20250921.pdf' }
  ];

  users: User[] = [
    { userId: 1, name: 'Admin User', email: 'admin@bank.com', role: 'Admin' },
    { userId: 2, name: 'Client User', email: 'client@company.com', role: 'Client' }
  ];



   documents: DocumentItem[] = [
    {
      documentId: 1,
      uploadedByUsername: 'EdwinGeorge',
      documentType: 'Aadhaar',
      documentStatus: 'Pending',
      uploadDate: new Date('2025-09-20T10:30:00'),
      fileName: 'aadhaar_edwin.pdf',
      filePath:'C:\Users\edwin.joseph\Pictures\Loan'
    },
    {
      documentId: 2,
      uploadedByUsername: 'AliceSmith',
      documentType: 'PAN',
      documentStatus: 'Approved',
      uploadDate: new Date('2025-09-18T14:45:00'),
      fileName: 'pan_alice.jpg',
      filePath:'https://pinetools.com/random-file-generator'
    }
  ];

   // Salary Disbursement (from SalaryDisbursement.cs)
 salaryDisbursement = {
  employeeId: null as number | null,
  amount: null as number | null,
  remarks: ''
};


  employees = [
    { id: 1, name: 'Alice Thomas' },
    { id: 2, name: 'John Doe' },
    { id: 3, name: 'Kavita Rao' }
  ];

  pastDisbursements = [
    { employeeName: 'Alice Thomas', amount: 35000, date: new Date(), status: 'Completed' },
    { employeeName: 'John Doe', amount: 30000, date: new Date(), status: 'Pending' }
  ];


  generateReport() {
    // Simulate generating report - in real app call API
    const newReport: Report = {
      reportId: this.reports.length + 1,
      reportType: this.selectedReportType,
      generatedDate: new Date(),
      filePath: '' // initially empty to simulate processing
    };

    this.reports.push(newReport);

    // Simulate delay in generating report file (e.g., API generates the PDF)
    setTimeout(() => {
      newReport.filePath = `reports/${this.selectedReportType.toLowerCase().replace(/ /g, '-')}-${new Date().toISOString().slice(0,10)}.pdf`;
    }, 3000);
  }

  logout(){
    localStorage.clear;
    this.router.navigate(['/login']);
  }



  approveDocument(doc: DocumentItem) {
    // change status to Approved
    doc.documentStatus = 'Approved';
    alert(`Document ${doc.documentId} approved.`);
    // Later: send backend request to update status
  }

  rejectDocument(doc: DocumentItem) {
    doc.documentStatus = 'Rejected';
    alert(`Document ${doc.documentId} rejected.`);
    // Later: backend call
  }


  viewDocument(filePath: string | undefined) {
  if (filePath) {
    window.open(filePath, '_blank');
  } else {
    alert('No document file available.');
  }
}

  submitSalaryDisbursement() {
    if (!this.salaryDisbursement.employeeId || !this.salaryDisbursement.amount) {
      alert("Please select an employee and enter amount.");
      return;
    }

    const selectedEmployee = this.employees.find(e => e.id == this.salaryDisbursement.employeeId);
    this.pastDisbursements.unshift({
      employeeName: selectedEmployee?.name || 'Unknown',
      amount: this.salaryDisbursement.amount,
      date: new Date(),
      status: 'Pending'
    });

    alert("Salary Disbursement Initiated (Mock)");

    // Reset salary form
    this.salaryDisbursement = {
      employeeId: null,
      amount: null,
      remarks: ''
    };

  }

  toggleUserInfo(index: number, event: Event): void {
  event.preventDefault();
  this.expandedUserIndex = this.expandedUserIndex === index ? null : index;
}

  closeModal() {
    this.showModal = false;
    this.selectedDocumentUrl = null;
  }
}

