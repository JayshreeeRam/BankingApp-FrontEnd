import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ClientService } from '../../services/client.service';
import { PaymentService } from '../../services/payment.service';
import { DocumentService } from '../../services/document.service';
import { ReportService } from '../../services/report.service';
import { EmployeeService } from '../../services/employee.service';
import { UserService } from '../../services/user.service';
import { SalaryDisbursementService } from '../../services/salary-disbursement.service';
import { SalaryDisbursement } from '../../Models/SalaryDisbursement';
import {  PaymentDto } from '../../DTOs/PaymentDto';
import { SalaryDisbursementDto } from '../../DTOs/SalaryDisbursementDto';
import { PaymentStatus } from '../../Enum/PaymentStatus 1';
import { Payment } from '../../Models/Payment';
import { UpdatePaymentDto } from '../../DTOs/UpdatePaymentDto';
import { SalaryDisbursementComponent } from '../salary-disbursement-component/salary-disbursement-component';
import { DocumentsComponent } from "../document-component/document-component";
import { AccountStatus } from '../../Enum/AccountStatus 1';
import { UserRole } from '../../Enum/UserRole 1';

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

interface DocumentItem {
  documentId: number;
  uploadedByUsername: string;
  documentType: string;
  documentStatus: string;
  uploadDate: Date;
  fileName: string;
  filePath?: string;
}

interface Report {
  reportId: number;
  reportType: string;
  generatedDate: Date;
  filePath?: string;
}

interface User {
  userId: number;
  username: string;
  email: string;
  // userRole: UserRole;
  phoneNumber?: string;
}

interface Employee {
  id: number; // table ID
  employeeId: number;
  employeeName : string;
  bankName: string;
  salary: number;
  senderName: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SafeUrlPipe,
    SalaryDisbursementComponent,
    DocumentsComponent
],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  activeTab: string = 'clients';
  PaymentStatus = PaymentStatus;
  AccountStatus = AccountStatus;
  clients: Client[] = [];
  users: User[] = [];
  employees: Employee[] = [];
  payments: PaymentDto[] = [];
  // payments: Payment[] = [];
  displayedPayments: PaymentDto[] = [];
  documents: DocumentItem[] = [];
  reports: Report[] = [];
  pastDisbursements: SalaryDisbursement[] = [];
  allClients: any[] = [];

  selectedReportType: string = 'Daily Transactions';
  reportTypes = ['Daily Transactions', 'Client Activity', 'Payment Summary'];

  salaryDisbursement: {
    employeeId: number | null;
    amount: number | null;
    remarks: string;
  } = { employeeId: null, amount: null, remarks: '' };

  expandedUserIndex: number | null = null;
  selectedDocumentUrl: string | null = null;
  showModal: boolean = false;
  showAllPayments: boolean = true; 
  showRejectRemarkIndex: number | null = null;

  constructor(
    private router: Router,
    private clientSvc: ClientService,
    private paymentSvc: PaymentService,
    private documentSvc: DocumentService,
    private reportSvc: ReportService,
    private employeeSvc: EmployeeService,
    private userSvc: UserService,
    private salaryDisburse: SalaryDisbursementService
  ) {}

  ngOnInit(): void {
    this.getAllClients();
    this.getAllUsers();
    this.getAllEmployees();
    this.getAllPayments();
    this.getAllDocuments();
    this.getReports();
    this.getPastDisbursements();
  }

  // --- Clients ---
  // getAllClients(event?: Event) {
  //   event?.preventDefault();
  //   this.clientSvc.getAllClients().subscribe({
  //     next: (data: any[]) => {
  //       this.clients = data.map(c => ({
  //         clientId: c.clientId,
  //         name: c.name,
  //         accountNo: c.accountNo,
  //         bankName: c.bankName,
  //         verificationStatus: c.verificationStatus
  //       }));
  //     },
  //     error: err => console.error('Error loading clients:', err)
  //   });
  // }

  getAllClients(event?: Event) {
  event?.preventDefault();
  this.clientSvc.getAllClients().subscribe({
    next: (data: any[]) => {
      this.allClients = data.map(c => ({
        clientId: c.clientId,
        name: c.name,
        accountNo: c.accountNo,
        bankName: c.bankName,
        verificationStatus: c.verificationStatus || 'Pending'
      }));
      this.clients = [...this.allClients]; // Show all clients initially
    },
    error: err => console.error('Error loading clients:', err)
  });
}

// New method to filter clients based on status
loadClients(filter: AccountStatus | 'all') {
  if (filter === 'all') {
    this.clients = [...this.allClients];
  } else {
    this.clients = this.allClients.filter(c => c.verificationStatus === filter);
  }
}


/**
 * Approve client — changes status to Approved
 */
approveClient(client: any) {
  this.clientSvc.approveClient(client.clientId).subscribe({
    next: (updatedClient) => {
      client.verificationStatus = updatedClient.verificationStatus;  // Should be AccountStatus.Active
      alert(`Client ${client.name} approved.`);
    },
    error: (err) => {
      console.error('Error approving client:', err);
      alert('Failed to approve client. Please try again.');
    }
  });
}


rejectClient(client: any) {
  client.AccountStatus = AccountStatus.Rejected ;
  alert(`Client ${client.name} rejected.`);
  // Call backend API to update status if needed
}


  // --- Users ---
  getAllUsers(event?: Event) {
    event?.preventDefault();
    this.userSvc.getAllUsers().subscribe({
      next: (data: any[]) => {
        console.log('Fetching all users from server...}',{ data});
        this.users = data.map(u => ({
          userId: u.userId,
          username: u.username,
          email: u.email,
          // userRole: u.role,
          phoneNumber: u.phoneNumber
        }));
      },
      error: err => console.error('Error loading users:', err)
    });
  }

  // --- Employees ---
 

getAllEmployees() {
  this.employeeSvc.getAllEmployees().subscribe({
    next: (data:any) => {
      alert('Fetching all employees from server...');
      this.employees = data;
      console.log('Employees loaded:', this.employees);
    },
    error: (err:any) => {
      console.error('Failed to load employees', err);
    }
  });
}


  // --- Payments ---
getAllPayments() {
 this.paymentSvc.getAllPayments().subscribe({
   next: (data: PaymentDto[]) => {
        console.log('Fetching all payments from server...');
        //  console.log('Raw payments:', data.map(p => typeof p.paymentStatus + ' → ' + p.paymentStatus));
     
        this.payments = data;
        this.updateDisplayedPayments();
      },
      error: err => console.error('Error loading payments:', err)
    });
}
 
  
 

// Helpers to map id → name
getClientNameById(id: number): string {
  const client = this.clients.find(c => c.clientId === id);
  return client ? client.name : 'Unknown';
}

getBeneficiaryNameById(id: number): string {
  const user = this.users.find(u => u.userId === id);
  return user ? user.username : 'Unknown';
}

// Filtered display function
getDisplayedPayments(): PaymentDto[] {
  return this.showAllPayments ? this.payments : this.payments.filter(p => p.paymentStatus === PaymentStatus.Pending);
}


 updateDisplayedPayments() {
  this.displayedPayments = this.showAllPayments
    ? this.payments
    : this.payments.filter(p => p.paymentStatus === PaymentStatus.Pending);
      console.log('Displayed Payments:', this.displayedPayments)
}



  togglePaymentsView(showAll: boolean) {
    this.showAllPayments = showAll;
    this.updateDisplayedPayments();
  }

 approvePayment(payment: PaymentDto) {
  this.paymentSvc.approvePayment(payment.paymentId).subscribe({
    next: () => {
      payment.paymentStatus = PaymentStatus.Approved;
      alert('✅ Payment approved successfully.');
      this.updateDisplayedPayments();
    },
    error: err => {
      alert(`❌ Failed to approve payment: ${err.error?.message || 'Unknown error'}`);
    }
  });
}




  rejectPayment(payment: PaymentDto) {
   
    this.paymentSvc.rejectPayment(payment.paymentId).subscribe({
      next: () => {
        payment.paymentStatus = PaymentStatus.Failed;
        alert('Payment rejected successfully.');
        this.updateDisplayedPayments();
      },
      error: err => console.error('Error rejecting payment:', err)
    });
  }

  toggleRejectRemark(index: number) {
    this.showRejectRemarkIndex = this.showRejectRemarkIndex === index ? null : index;
  }

  // --- Documents ---
  getAllDocuments() {
    this.documentSvc.getAllDocuments().subscribe({
      next: (data: any[]) => this.documents = data,
      error: err => console.error('Error loading documents:', err)
    });
  }

  viewDocument(filePath?: string) {
    if (filePath) window.open(filePath, '_blank');
    else alert('No document file available.');
  }

  // --- Reports ---
  getReports() {
    this.reportSvc.getAllReports().subscribe({
      next: (data: any[]) => this.reports = data,
      error: err => console.error('Error loading reports:', err)
    });
  }

  // --- Salary Disbursement ---
  

  onEmployeeChange(selectedEmpId: number) {
    const selectedEmp = this.employees.find(emp => emp.id === selectedEmpId);
    this.salaryDisbursement.amount = selectedEmp ? selectedEmp.salary : null;
  }

  getPastDisbursements() {
    this.salaryDisburse.getAllSalaryDisbursements().subscribe({
      next: data => this.pastDisbursements = data,
      error: err => console.error('Error loading past disbursements:', err)
    });
  }

  // --- Utility ---
  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  toggleUserInfo(index: number, event: Event) {
    event.preventDefault();
    this.expandedUserIndex = this.expandedUserIndex === index ? null : index;
  }

  closeModal() {
    this.showModal = false;
    this.selectedDocumentUrl = null;
  }
}
