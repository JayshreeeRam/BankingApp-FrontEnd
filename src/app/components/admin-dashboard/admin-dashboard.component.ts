import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
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
import { UserDto } from '../../DTOs/UserDto';
import { ChangeDetectorRef } from '@angular/core';


// In your component class


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
    RouterLink
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  activeTab: string = 'clients';
  isSidebarCollapsed: boolean = false;
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
  pageSize: number = 4; 
  currentPage: number = 1;
   filteredClients: any[] = [];
    searchQuery: string = '';
    searchPaymentQuery: string = '';
filteredPayments: any[] = [];
paymentPageSize = 8;
paymentCurrentPage = 1;
employeeSearchQuery: string = '';
filteredEmployees: any[] = [];
pagedEmployees: any[] = [];

employeeCurrentPage: number = 1;
employeePageSize: number = 5;
employeeTotalPages: number = 1;
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
  clientRejectionRemarkInvalid: boolean = false;

  // Loading states
  isLoading: boolean = false;
  isRejecting: boolean = false;
  errorMessage: string = '';
  currentFilter: string = 'all';
  showViewDetails: boolean = true;

  // salarySearch

salarySearchQuery: string = '';
filteredSalaries: any[] = [];
pagedSalaries: any[] = [];

salaryPageSize: number = 10;
salaryCurrentPage: number = 1;
salaryTotalPages: number = 1;

salaries: any[] = [];


selectedClientAccountNo: string = '';


  constructor(
    private router: Router,
    private clientSvc: ClientService,
    private paymentSvc: PaymentService,
    private documentSvc: DocumentService,
    private reportSvc: ReportService,
    private employeeSvc: EmployeeService,
    private userSvc: UserService,
    private salaryDisburse: SalaryDisbursementService,
    private cdRef: ChangeDetectorRef
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
    this.applyFilter();
    
  }

  // --- Clients ---
  getAllClients(event?: Event) {
    event?.preventDefault();
    this.isLoading = true;
    this.clientSvc.getAllClients().subscribe({
      next: (data: ClientDto[]) => {
        this.allClients = data;
        this.clients = [...this.allClients];
        this.isLoading = false;
      },
      error: err => {
        console.error('Error loading clients:', err);
        this.isLoading = false;
        this.errorMessage = 'Failed to load clients';
      }
    });
  }

  loadClients(filter: AccountStatus | AccountStatus[] | 'all') {
    if (filter === 'all') {
      this.clients = [...this.allClients];
      this.currentFilter = 'all';
    } else if (Array.isArray(filter)) {
      // Handle multiple statuses
      this.clients = this.allClients.filter(c => 
        c.verificationStatus !== undefined && 
        filter.includes(c.verificationStatus as AccountStatus)
      );
      this.currentFilter = 'pending';
    } else {
      // Handle single status
      this.clients = this.allClients.filter(c => c.verificationStatus === filter);
      this.currentFilter = filter.toLowerCase();
    }
  }

  approveClient(client: ClientDto) {
    if (!confirm(`Are you sure you want to approve ${client.name}?`)) {
      return;
    }

    console.log('🔄 Approving client ID:', client.clientId);
    
    // Set loading state for this client
    client.isLoading = true;

    this.clientSvc.approveClient(client.clientId).subscribe({
      next: (updatedClient) => {
        console.log('✅ Approval successful:', updatedClient);
        
        // Update the client in the local array
        const index = this.clients.findIndex(c => c.clientId === client.clientId);
        if (index !== -1) {
          this.clients[index] = { ...updatedClient, isLoading: false };
        }
        
        this.showNotification(`Client ${client.name} approved successfully.`, 'success');
      },
      error: (err) => {
        console.error('❌ Error approving client:', err);
        client.isLoading = false;
        
        const errorMsg = this.getErrorMessage(err);
        this.showNotification(`Failed to approve client: ${errorMsg}`, 'error');
      }
    });
  }

  // Client rejection methods - USE THESE INSTEAD
openClientRejectionDialog(client: ClientDto) {
  console.log('🔄 Opening rejection dialog for client:', client.clientId, client.name);
  
  this.selectedClientForRejection = client;
  this.clientRejectionRemark = '';
  this.clientRejectionRemarkInvalid = false;
  this.showClientRejectionDialog = true;
  
  console.log('✅ Dialog state set - showClientRejectionDialog:', this.showClientRejectionDialog);
}

confirmClientRejection() {
  console.log('🔄 Confirm rejection called');
  console.log('Selected client:', this.selectedClientForRejection);
  console.log('Rejection remark:', this.clientRejectionRemark);
  
  if (!this.selectedClientForRejection) {
    console.error('❌ No client selected for rejection');
    this.showNotification('No client selected for rejection.', 'error');
    return;
  }

  // Validate rejection remark
  if (!this.clientRejectionRemark?.trim()) {
    console.warn('⚠️ Rejection remark is empty');
    this.clientRejectionRemarkInvalid = true;
    this.showNotification('Please provide a rejection remark.', 'error');
    this.cdRef.detectChanges(); 
    return;
  }

  this.clientRejectionRemarkInvalid = false;
  this.isRejecting = true;
  
  console.log('🔄 Calling rejectClient API...');
  console.log('Client ID:', this.selectedClientForRejection.clientId);
  console.log('Client Name:', this.selectedClientForRejection.name);
  console.log('Remark:', this.clientRejectionRemark);

  this.clientSvc.rejectClient(this.selectedClientForRejection.clientId, this.clientRejectionRemark)
    .subscribe({
      next: (rejectedClient) => {
        console.log('✅ Client rejection API call successful:', rejectedClient);
        
        // Update the client in the local array
        const index = this.clients.findIndex(c => c.clientId === rejectedClient.clientId);
        if (index !== -1) {
          this.clients[index] = rejectedClient;
          console.log('✅ Client updated in local array at index:', index);
        } else {
          console.warn('⚠️ Client not found in local array, refreshing list...');
          this.getAllClients(); // Make sure this method exists and works
        }
        
        this.showNotification('Client rejected successfully.', 'success');
        this.closeClientRejectionDialog();
      },
      error: (err: any) => {
        console.error('❌ Error rejecting client:', err);
        console.error('Error details:', {
          status: err.status,
          statusText: err.statusText,
          message: err.message,
          error: err.error
        });
        
        this.isRejecting = false;
        
        let errorMessage = 'Failed to reject client. Please try again.';
        
        if (err.error?.message) {
          errorMessage = err.error.message;
        } else if (err.status === 404) {
          errorMessage = 'Client not found. It may have been deleted.';
        } else if (err.status === 400) {
          errorMessage = err.error?.message || 'Cannot reject this client. It may not be in pending status.';
        } else if (err.status === 500) {
          errorMessage = 'Server error occurred. Please try again later.';
        } else if (err.status === 0) {
          errorMessage = 'Network error. Please check your connection.';
        }
        
        this.showNotification(errorMessage, 'error');
      },
      complete: () => {
        console.log('🔚 Client rejection observable completed');
        this.isRejecting = false;
      }
    });
}

closeClientRejectionDialog() {
  console.log('🔒 Closing client rejection dialog...');
  console.log('Current dialog state before closing:', this.showClientRejectionDialog);
  
  this.showClientRejectionDialog = false;
  this.selectedClientForRejection = null;
  this.clientRejectionRemark = '';
  this.clientRejectionRemarkInvalid = false;
  this.isRejecting = false;
  
  // Force Angular to detect changes
  this.cdRef.detectChanges();
  
  console.log('✅ Client rejection dialog closed and reset');
  console.log('Dialog state after closing:', this.showClientRejectionDialog);
}

  viewClientDetails(client: ClientDto) {
    console.log('Viewing client details:', client);
    
    const details = `
      Client Details:
      
      ID: ${client.clientId}
      Name: ${client.name}
      Account Number: ${client.accountNo || 'N/A'}
      Status: ${client.verificationStatus || 'Pending'}
      ${client.rejectionRemark ? `Rejection Reason: ${client.rejectionRemark}` : ''}
    `;
    
    alert(details);
  }

  private getErrorMessage(error: any): string {
    if (error.error && typeof error.error === 'string') {
      return error.error;
    }
    if (error.error?.message) {
      return error.error.message;
    }
    if (error.status === 400) {
      return 'Bad request. The client data may be invalid.';
    }
    if (error.status === 404) {
      return 'Client not found.';
    }
    return 'Please try again.';
  }

  private showNotification(message: string, type: 'success' | 'error') {
    alert(message);
  }



  // --- Users ---
  getAllUsers(event?: Event) {
    event?.preventDefault();
    this.userSvc.getAllUsers().subscribe({
      next: (users: UserDto[] | undefined) => {
        const safeUsers = users || [];
        
        this.users = safeUsers.map(u => ({
          userId: u.userId,
          username: u.username,
          email: u.email,
          phoneNumber: u.phoneNumber
        }));
      },
      error: err => {
        console.error('Error loading users:', err);
        this.errorMessage = 'Failed to load users';
      }
    });
  }

  // --- Employees ---
  getAllEmployees() {
    this.employeeSvc.getAllEmployees().subscribe({
      next: (data: any) => {
        this.employees = data;
        console.log('Employees loaded:', this.employees);
      },
      error: (err: any) => {
        console.error('Failed to load employees', err);
        this.errorMessage = 'Failed to load employees';
      }
    });
  }

  // --- Payments ---
  beneficiaries: { beneficiaryId: number, beneficiaryName: string }[] = [];

  getAllPayments() {
    this.paymentSvc.getAllPayments().subscribe({
      next: (data: PaymentDto[]) => {
        console.log('Fetching all payments from server...');
        this.payments = data.map(p => ({
          ...p,
          clientName: this.getClientNameById(p.clientId),
          beneficiaryName: this.getBeneficiaryNameById(p.beneficiaryId)
        }));
        this.updateDisplayedPayments();
      },
      error: err => {
        console.error('Error loading payments:', err);
        this.errorMessage = 'Failed to load payments';
      }
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

  updateDisplayedPayments() {
    this.displayedPayments = this.showAllPayments
      ? this.payments
      : this.payments.filter(p => p.paymentStatus === PaymentStatus.Pending);
  }

  togglePaymentsView(showAll: boolean) {
    this.showAllPayments = showAll;
    this.updateDisplayedPayments();
  }

  approvePayment(payment: PaymentDto) {
    if (!confirm(`Approve payment of $${payment.amount}?`)) return;

    payment.isLoading = true;
    this.paymentSvc.approvePayment(payment.paymentId).subscribe({
      next: () => {
        payment.paymentStatus = PaymentStatus.Approved;
        payment.isLoading = false;
        this.showNotification('✅ Payment approved successfully.', 'success');
        this.updateDisplayedPayments();
      },
      error: err => {
        (payment as any).isLoading = false;
        this.showNotification(`❌ Failed to approve payment: ${err.error?.message || 'Unknown error'}`, 'error');
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

    this.isRejecting = true;
    this.paymentSvc.rejectPayment(this.selectedPaymentForRejection.paymentId, this.rejectionRemark)
      .subscribe({
        next: (rejectedPayment) => {
          const index = this.payments.findIndex(p => p.paymentId === rejectedPayment.paymentId);
          if (index !== -1) {
            this.payments[index] = rejectedPayment;
          }
          this.showNotification('Payment rejected successfully.', 'success');
          this.updateDisplayedPayments();
          this.closeRejectionDialog();
          this.isRejecting = false;
        },
        error: (err) => {
          console.error('Error rejecting payment:', err);
          this.isRejecting = false;
          this.showNotification('Failed to reject payment. Please try again.', 'error');
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
      case AccountStatus.Frozen: return 'status-frozen';
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
      error: err => {
        console.error('Error loading documents:', err);
        this.errorMessage = 'Failed to load documents';
      }
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
      error: err => {
        console.error('Error loading reports:', err);
        this.errorMessage = 'Failed to load reports';
      }
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
      error: err => {
        console.error('Error loading past disbursements:', err);
        this.errorMessage = 'Failed to load salary disbursements';
        
      }
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

   get totalPages(): number {
    return Math.ceil(this.filteredClients.length / this.pageSize) || 1;
  }

    nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  // Move to the previous page if not already at first page
  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

   applyFilter() {
    // Filter clients based on the search query
    this.filteredClients = this.clients.filter(client =>
      client.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      client.clientId.toString().includes(this.searchQuery)
    );
    this.currentPage = 1; // Reset to the first page when a filter is applied
  }

  // Clear error message
  clearError() {
    this.errorMessage = '';
  }
  // Add these methods to your component
getClientsCount(): number {
  return this.clients.length;
}

getUsersCount(): number {
  return this.users.length;
}

getPaymentsCount(): number {
  return this.payments.length;
}

getPendingDocumentsCount(): number {
  // Implement based on your documents data
  return 0;
}

getPendingClientsCount(): number {
  return this.clients.filter(c => c.verificationStatus === 'Pending').length;
}

getApprovedClientsCount(): number {
  return this.clients.filter(c => c.verificationStatus === 'Approved').length;
}

getRejectedClientsCount(): number {
  return this.clients.filter(c => c.verificationStatus === 'Rejected').length;
}



exportClients() {
  // Implement export functionality
  console.log('Export clients functionality');
}

// payment search filteration and pagination 

get paymentTotalPages(): number {
  return Math.ceil(this.filteredPayments.length / this.paymentPageSize);
}

applyPaymentFilter() {
  const query = this.searchPaymentQuery.toLowerCase().trim();

  // If query is empty, reset filteredPayments to all displayedPayments
  if (!query) {
    this.filteredPayments = [...this.displayedPayments];
  } else {
    this.filteredPayments = this.displayedPayments.filter(p =>
      (p.clientName && p.clientName.toLowerCase().includes(query)) ||
      (p.paymentId && p.paymentId.toString().toLowerCase().includes(query)) ||
      (p.beneficiaryName && p.beneficiaryName.toLowerCase().includes(query))
    );
  }

  this.paymentCurrentPage = 1; // Reset pagination
}
get pagedPayments(): PaymentDto[] {
  const startIndex = (this.paymentCurrentPage - 1) * this.paymentPageSize;
  return this.filteredPayments.slice(startIndex, startIndex + this.paymentPageSize);
}



nextPaymentPage() {
  if (this.paymentCurrentPage < this.paymentTotalPages) {
    this.paymentCurrentPage++;
  }
}

prevPaymentPage() {
  if (this.paymentCurrentPage > 1) {
    this.paymentCurrentPage--;
  }
}

// employees search and pagination 

applyEmployeeFilter(): void {
  const query = this.employeeSearchQuery.toLowerCase().trim();

  this.filteredEmployees = this.employees.filter(emp =>
    emp.employeeName?.toLowerCase().includes(query) ||
    emp.employeeId?.toString().includes(query) ||
    emp.senderName?.toLowerCase().includes(query)
  );

  this.employeeCurrentPage = 1;
  this.calculateEmployeePagination();
}

calculateEmployeePagination(): void {
  this.employeeTotalPages = Math.ceil(this.filteredEmployees.length / this.employeePageSize);
  const start = (this.employeeCurrentPage - 1) * this.employeePageSize;
  const end = this.employeeCurrentPage * this.employeePageSize;
  this.pagedEmployees = this.filteredEmployees.slice(start, end);
}

// salary filter and search and pagination 
applySalaryFilter(): void {
  const query = this.salarySearchQuery?.toLowerCase().trim();

  if (!query) {
    this.filteredSalaries = [...this.salaries];
  } else {
    this.filteredSalaries = this.salaries.filter((s: any) => 
      (s.employeeName?.toLowerCase().includes(query)) ||
      (s.senderName?.toLowerCase().includes(query)) ||
      (s.employeeId?.toString().includes(query))
    );
  }

  this.salaryCurrentPage = 1;
  
}

viewDocuments(client: any) {
  this.selectedClientAccountNo = client.accountNo;
  this.activeTab = 'documents';
}



}