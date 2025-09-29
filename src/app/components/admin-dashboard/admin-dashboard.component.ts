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
  name: string;
  email: string;
  role: string;
  phoneNumber?: string;
}

interface Employee {
  id: number; // table ID
  employeeId: number;
  name: string;
  bankName: string;
  salary: number;
  clientName: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, SafeUrlPipe],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  activeTab: string = 'clients';
  PaymentStatus = PaymentStatus;

  clients: Client[] = [];
  users: User[] = [];
  employees: Employee[] = [];
  // payments: PaymentDto[] = [];
  payments: Payment[] = [];
  displayedPayments: PaymentDto[] = [];
  documents: DocumentItem[] = [];
  reports: Report[] = [];
  pastDisbursements: SalaryDisbursement[] = [];

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
    // this.getAllPayments();
    this.getAllDocuments();
    this.getReports();
    this.getPastDisbursements();
  }

  // --- Clients ---
  getAllClients(event?: Event) {
    event?.preventDefault();
    this.clientSvc.getAllClients().subscribe({
      next: (data: any[]) => {
        this.clients = data.map(c => ({
          clientId: c.clientId,
          name: c.name,
          accountNo: c.accountNo,
          bankName: c.bankName,
          verificationStatus: c.verificationStatus
        }));
      },
      error: err => console.error('Error loading clients:', err)
    });
  }

  // --- Users ---
  getAllUsers(event?: Event) {
    event?.preventDefault();
    this.userSvc.getAllUsers().subscribe({
      next: (data: any[]) => {
        this.users = data.map(u => ({
          userId: u.userId,
          name: u.name,
          email: u.email,
          role: u.role,
          phoneNumber: u.phoneNumber
        }));
      },
      error: err => console.error('Error loading users:', err)
    });
  }

  // --- Employees ---
  getAllEmployees() {
    this.employeeSvc.getAllEmployees().subscribe({
      next: (data: any[]) => {
        this.employees = data.map((e, index) => ({
          id: index + 1,
          employeeId: e.employeeId,
          name: e.employeeName,
          bankName: e.bankName || '',
          salary: e.salary,
          clientName: e.senderName || ''
        }));
      },
      error: err => console.error('Error loading employees:', err)
    });
  }

  // --- Payments ---
// getAllPayments() {
//   this.paymentSvc.getAllPayments().subscribe({
//     next: (data: PaymentDto[]) => {
//       this.payments = data.map((p, index) => ({
//         paymentId: index + 1,            // unique display id
//         clientId: p.clientId,            // required
//         beneficiaryId: p.beneficiaryId,  // required
//         amount: p.amount,
//         paymentDate: new Date(p.paymentDate),
//         paymentStatus: p.paymentStatus.toString // convert enum to string
//       }));
//     },
//     error: err => console.error('Error loading payments:', err)
//   });
// }
 
  
 

// Helpers to map id → name
getClientNameById(id: number): string {
  const client = this.clients.find(c => c.clientId === id);
  return client ? client.name : 'Unknown';
}

getBeneficiaryNameById(id: number): string {
  const user = this.users.find(u => u.userId === id);
  return user ? user.name : 'Unknown';
}

// Filtered display function
getDisplayedPayments(): Payment[] {
  return this.showAllPayments ? this.payments : this.payments.filter(p => p.paymentStatus === PaymentStatus.Pending);
}


  updateDisplayedPayments() {
  return 1;
  }

  // getPendingPayments(): PaymentDto[] {
  //   return this.payments.filter(p => p.paymentStatus === PaymentStatus.Pending);
  // }



  togglePaymentsView(showAll: boolean) {
    this.showAllPayments = showAll;
    this.updateDisplayedPayments();
  }

  approvePayment(payment: PaymentDto) {
    this.paymentSvc.approvePayment(payment.clientId).subscribe({
      next: () => {
        payment.paymentStatus = PaymentStatus.Approved;
        alert('Payment approved successfully.');
        this.updateDisplayedPayments();
      },
      error: err => console.error('Error approving payment:', err)
    });
  }



  rejectPayment(payment: PaymentDto) {
   
    this.paymentSvc.rejectPayment(payment.clientId).subscribe({
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
  submitSalaryDisbursement() {
    if (!this.salaryDisbursement.employeeId) {
      alert('Please select an employee.');
      return;
    }

    const selectedEmp = this.employees.find(emp => emp.id === this.salaryDisbursement.employeeId);
    if (!selectedEmp) {
      alert('Selected employee not found.');
      return;
    }

    const dto = new SalaryDisbursementDto(
      0,
      selectedEmp.employeeId,
      selectedEmp.name,
      selectedEmp.clientName || 'N/A',
      selectedEmp.id,
      selectedEmp.salary,
      new Date(),
      PaymentStatus.Pending,
      0
    );

    this.salaryDisburse.addSalaryDisbursement(dto).subscribe({
      next: res => {
        alert('Salary Disbursement Initiated');
        this.getPastDisbursements();
        this.salaryDisbursement = { employeeId: null, amount: null, remarks: '' };
      },
      error: err => console.error('Error disbursing salary:', err)
    });
  }

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
