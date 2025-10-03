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
import { PaymentDto } from '../../DTOs/PaymentDto';
import { SalaryDisbursementDto } from '../../DTOs/SalaryDisbursementDto';
import { PaymentStatus } from '../../Enum/PaymentStatus 1';
import { Payment } from '../../Models/Payment';
import { UpdatePaymentDto } from '../../DTOs/UpdatePaymentDto';
import { SalaryDisbursementComponent } from '../salary-disbursement-component/salary-disbursement-component';
import { DocumentsComponent } from "../document-component/document-component";
import { AccountStatus } from '../../Enum/AccountStatus 1';
import { UserRole } from '../../Enum/UserRole 1';
import { ReportComponent } from '../report-component/report-component';
import { ClientDto } from '../../DTOs/ClientDto';

@Pipe({ name: 'safeUrl' })
export class SafeUrlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
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
  phoneNumber?: string;
}

interface Employee {
  id: number;
  employeeId: number;
  employeeName: string;
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
    DocumentsComponent,
    ReportComponent,
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  activeTab: string = 'clients';
  PaymentStatus = PaymentStatus;
  AccountStatus = AccountStatus;
  clients: ClientDto[] = [];
  users: User[] = [];
  employees: Employee[] = [];
  payments: PaymentDto[] = [];
  displayedPayments: PaymentDto[] = [];
  documents: DocumentItem[] = [];
  reports: Report[] = [];
  pastDisbursements: SalaryDisbursement[] = [];
  allClients: ClientDto[] = [];

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
  
  // Payment rejection properties
  rejectionRemark: string = '';
  selectedPaymentForRejection: PaymentDto | null = null;
  showRejectionDialog: boolean = false;

  // Client rejection properties
  showClientRejectionDialog: boolean = false;
  selectedClientForRejection: ClientDto | null = null;
  clientRejectionRemark: string = '';

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
  
  checkAuthStatus() {
    console.log('🔍 Authentication Status Check:');
    console.log('Token exists:', !!localStorage.getItem('token'));
    console.log('Token value:', localStorage.getItem('token'));
    console.log('User:', localStorage.getItem('user'));
    console.log('Role:', localStorage.getItem('role'));
    console.log('All localStorage:', { ...localStorage });
    
    this.clientSvc.getAllClients().subscribe({
      next: (clients) => {
        console.log('✅ Request successful with token');
      },
      error: (err) => {
        console.error('❌ Request failed:', err);
        if (err.status === 401) {
          console.log('💡 401 Error - Token might be missing or invalid');
        }
      }
    });
  }

  ngOnInit(): void {
    this.checkAuthStatus(); 
    this.getAllClients();
    this.getAllUsers();
    this.getAllEmployees();
    this.getAllPayments();
    this.getAllDocuments();
    this.getReports();
    this.getPastDisbursements();
  }

  // --- Clients ---
  getAllClients(event?: Event) {
    event?.preventDefault();
    this.clientSvc.getAllClients().subscribe({
      next: (data: ClientDto[]) => {
        this.allClients = data;
        this.clients = [...this.allClients];
      },
      error: err => console.error('Error loading clients:', err)
    });
  }

  loadClients(filter: AccountStatus | 'all') {
    if (filter === 'all') {
      this.clients = [...this.allClients];
    } else {
      this.clients = this.allClients.filter(c => c.verificationStatus === filter);
    }
  }

  approveClient(client: ClientDto) {
    if (!confirm('Are you sure you want to approve this client?')) {
      return;
    }

    this.clientSvc.approveClient(client.clientId).subscribe({
      next: (updatedClient) => {
        // Update the client in the local array
        const index = this.clients.findIndex(c => c.clientId === client.clientId);
        if (index !== -1) {
          this.clients[index] = updatedClient;
        }
        alert(`Client ${client.name} approved.`);
      },
      error: (err) => {
        console.error('Error approving client:', err);
        alert('Failed to approve client. Please try again.');
      }
    });
  }

  // Client rejection methods
  openClientRejectionDialog(client: ClientDto) {
    this.selectedClientForRejection = client;
    this.clientRejectionRemark = '';
    this.showClientRejectionDialog = true;
  }

  confirmClientRejection() {
    if (!this.selectedClientForRejection) return;

    if (!this.clientRejectionRemark.trim()) {
      alert('Please provide a rejection remark.');
      return;
    }

    this.clientSvc.rejectClient(this.selectedClientForRejection.clientId, this.clientRejectionRemark)
      .subscribe({
        next: (rejectedClient) => {
          // Update the client in the local array
          const index = this.clients.findIndex(c => c.clientId === rejectedClient.clientId);
          if (index !== -1) {
            this.clients[index] = rejectedClient;
          }
          alert('Client rejected successfully and email sent.');
          this.closeClientRejectionDialog();
        },
        error: (err: any) => {
          console.error('Error rejecting client:', err);
          let errorMessage = 'Failed to reject client.';
          
          if (err.error?.message) {
            errorMessage = err.error.message;
          } else if (err.status === 404) {
            errorMessage = 'Client not found.';
          } else if (err.status === 400) {
            errorMessage = 'Cannot reject this client. It may not be in pending status.';
          }
          
          alert(errorMessage);
        }
      });
  }

  closeClientRejectionDialog() {
    this.showClientRejectionDialog = false;
    this.selectedClientForRejection = null;
    this.clientRejectionRemark = '';
  }

  // --- Users ---
  getAllUsers(event?: Event) {
    event?.preventDefault();
    this.userSvc.getAllUsers().subscribe({
      next: (data: any[]) => {
        console.log('Fetching all users from server...', { data });
        this.users = data.map(u => ({
          userId: u.userId,
          username: u.username,
          email: u.email,
          phoneNumber: u.phoneNumber
        }));
      },
      error: err => console.error('Error loading users:', err)
    });
  }

  // --- Employees ---
  getAllEmployees() {
    this.employeeSvc.getAllEmployees().subscribe({
      next: (data: any) => {
        alert('Fetching all employees from server...');
        this.employees = data;
        console.log('Employees loaded:', this.employees);
      },
      error: (err: any) => {
        console.error('Failed to load employees', err);
      }
    });
  }

  // --- Payments ---
  getAllPayments() {
    this.paymentSvc.getAllPayments().subscribe({
      next: (data: PaymentDto[]) => {
        console.log('Fetching all payments from server...');
        this.payments = data;
        this.updateDisplayedPayments();
      },
      error: err => console.error('Error loading payments:', err)
    });
  }

  getClientNameById(id: number): string {
    const client = this.clients.find(c => c.clientId === id);
    return client ? client.name : 'Unknown';
  }

  getBeneficiaryNameById(id: number): string {
    const user = this.users.find(u => u.userId === id);
    return user ? user.username : 'Unknown';
  }

  getDisplayedPayments(): PaymentDto[] {
    return this.showAllPayments ? this.payments : this.payments.filter(p => p.paymentStatus === PaymentStatus.Pending);
  }

  updateDisplayedPayments() {
    this.displayedPayments = this.showAllPayments
      ? this.payments
      : this.payments.filter(p => p.paymentStatus === PaymentStatus.Pending);
    console.log('Displayed Payments:', this.displayedPayments);
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

  // Payment rejection methods
  openRejectionDialog(payment: PaymentDto) {
    this.selectedPaymentForRejection = payment;
    this.rejectionRemark = '';
    this.showRejectionDialog = true;
  }

  closeRejectionDialog() {
    this.showRejectionDialog = false;
    this.selectedPaymentForRejection = null;
    this.rejectionRemark = '';
  }

  confirmRejection() {
    if (!this.selectedPaymentForRejection) return;
    
    if (!this.rejectionRemark.trim()) {
      alert('Please provide a rejection remark.');
      return;
    }

    this.paymentSvc.rejectPayment(this.selectedPaymentForRejection.paymentId, this.rejectionRemark)
      .subscribe({
        next: (rejectedPayment) => {
          // Update the payment in the list
          const index = this.payments.findIndex(p => p.paymentId === rejectedPayment.paymentId);
          if (index !== -1) {
            this.payments[index] = rejectedPayment;
          }
          alert('Payment rejected successfully.');
          this.updateDisplayedPayments();
          this.closeRejectionDialog();
        },
        error: (err) => {
          console.error('Error rejecting payment:', err);
          alert('Failed to reject payment. Please try again.');
        }
      });
  }

  // Status styling methods
  getClientStatusClass(status: AccountStatus | undefined): string {
    if (!status) return 'status-pending';
    
    switch (status) {
      case AccountStatus.Pending: return 'status-pending';
      case AccountStatus.Active: 
      case AccountStatus.Approved: return 'status-approved';
      case AccountStatus.Rejected: return 'status-rejected';
      default: return 'status-pending';
    }
  }

  getPaymentStatusClass(status: PaymentStatus | undefined): string {
    if (!status) return 'status-pending';
    
    switch (status) {
      case PaymentStatus.Pending: return 'status-pending';
      case PaymentStatus.Approved: return 'status-approved';
      case PaymentStatus.Rejected: 
      case PaymentStatus.Failed: return 'status-rejected';
      default: return 'status-pending';
    }
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