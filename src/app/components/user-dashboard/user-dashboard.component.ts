import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { TransactionService } from '../../services/transaction.service';
import { BeneficiaryService } from '../../services/beneficiary.service';
import { PaymentService } from '../../services/payment.service';
import { DocumentService } from '../../services/document.service';
import { CreatePaymentDto } from '../../DTOs/CreatePaymentDto';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserDto } from '../../DTOs/UserDto';
import { AuthService } from '../../services/auth.service';
import { BeneficiaryDto } from '../../DTOs/Beneficiary.dto';
import { SalaryDisbursementDto } from '../../DTOs/SalaryDisbursementDto';
import { SalaryDisbursementService } from '../../services/salary-disbursement.service';
import { PaymentStatus } from '../../Enum/PaymentStatus 1';
import { SalaryDisbursement } from '../../Models/SalaryDisbursement';
import { EmployeeService } from '../../services/employee.service';
import emailjs from '@emailjs/browser';
import { EmployeeDto } from '../../DTOs/EmployeeDto';
import { ThisReceiver } from '@angular/compiler';
import { ClientService } from '../../services/client.service';
import { ClientDto } from '../../DTOs/ClientDto';
import { ReportComponent } from '../report-component/report-component';
 
 
@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule,ReportComponent],
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  activeTab: string = 'home';
 showBeneficiaryList: boolean = false;
  profile: UserDto | any = { userId: 0, username: '', email: '', phoneNumber: '' };
  currentUserId!: number;
 
  transactions: any[] = [];
 
  beneficiaries: BeneficiaryDto[] = [];
  selectedBeneficiary?: BeneficiaryDto;
 
  payment = { beneficiaryId: 0, amount: null as number | null, remarks: '' };
 
  documents: any[] = [];
  aadhaarFile: File | null = null;
  panFile: File | null = null;
 
  support = {
  name: '',
  email: '',
  subject: '',
  message: ''
};
 filteredEmployees: EmployeeDto[] = [];
employees: any[] = [];
isEmployee: boolean = false;

 
 salaryDisbursement: {
    employeeId: number | null;
    amount: number | null;
    batchId: number | null;
  } = { employeeId: null, amount: null, batchId: null };

  pageSize: number = 10;
currentPage: number = 1;
pastDisbursements: SalaryDisbursement[] = [];
paginatedDisbursements: SalaryDisbursement[] = [];

 
  constructor(
    private router: Router,
    private userService: UserService,
    private txService: TransactionService,
    private beneficiaryService: BeneficiaryService,
    private paymentService: PaymentService,
    private documentService: DocumentService,
    private authService: AuthService,
    private employeeService:EmployeeService,
    private salaryDisburse: SalaryDisbursementService,
    private clientService:ClientService,
  ) {}
 
  ngOnInit(): void {
    const userId = this.authService.getUserIdFromToken();
    if (!userId) {
      this.router.navigate(['/login']);
      return;
    }
   
    this.currentUserId = userId;
    console.log('Current User ID:', this.currentUserId);
    this.loadProfile(userId);
    this.loadBeneficiaries();
    this.loadTransactions();
    this.loadDocuments();
   this.loadEmployeesForCurrentClient();
    this.getPastDisbursements();
    console.log('Filtered Employees:', this.filteredEmployees);
    console.log("Current Client ID in ngOnInit:", this.currentClientId);
     this.getClientIdForCurrentUser();
     this.getEmployees  ();
    
  }
 
onTabChange(tab: string) {
  this.activeTab = tab;

  if (tab === 'employee') {
    this.loadEmployeesForCurrentClient();
  }
  if (tab === 'salary') {
    if (!this.employeeDataLoaded) {
      this.loadEmployeesForCurrentClient();
    }
    this.getPastDisbursements();
  }
}

getEmployeeNameById(id: number): string {
  const emp = this.employees.find(e => e.employeeId === id);
  return emp ? emp.employeeName : 'Unknown';
}

  // ================= Profile =================
  loadProfile(userId: number) {
    this.userService.getUserById(userId).subscribe({
      next: (user) => (this.profile = user),
      error: (err) => console.error('Error loading profile', err)
    });
  }
 
  updateProfile() {
    this.userService.updateUser(this.currentUserId, this.profile).subscribe({
      next: () => alert('Profile updated successfully'),
      error: (err) => console.error(err)
    });
  }
 
  // ================= Transactions =================
  loadTransactions() {
    this.txService.getTransactionsByUserId(this.currentUserId).subscribe({
  next: (res) => (this.transactions = res),
  error: (err) => console.error(err)
});
  }
 
  goToTransactions() {
    this.activeTab = 'transactions';
  }
 
  // ================= Beneficiaries =================
  loadBeneficiaries() {
    this.beneficiaryService.getAllBeneficiaries().subscribe({
      next: (res: BeneficiaryDto[]) => {
        // this.beneficiaries = res.filter(b => b.clientId === this.currentUserId);
          this.beneficiaries = res;
      },
      error: (err) => console.error('Error loading beneficiaries', err)
    });
  }
toggleBeneficiaryList() {
    this.showBeneficiaryList = !this.showBeneficiaryList;
  }
  onBeneficiarySelect(event: Event) {
    const target = event.target as HTMLSelectElement;
    const id = Number(target.value);
    this.selectedBeneficiary = this.beneficiaries.find(b => b.beneficiaryId === id);
    if (this.selectedBeneficiary) this.payment.beneficiaryId = this.selectedBeneficiary.beneficiaryId;
  }
 
  deleteSelectedBeneficiary() {
    if (!this.selectedBeneficiary) return alert('No beneficiary selected');
 
    this.beneficiaryService.deleteBeneficiary(this.selectedBeneficiary.beneficiaryId).subscribe({
      next: () => {
        alert('Beneficiary deleted');
        this.selectedBeneficiary = undefined;
        this.loadBeneficiaries();
      },
      error: (err) => console.error('Error deleting beneficiary', err)
    });
  }
 
  onCreateNewBeneficiary() {
    this.router.navigate(['/create-beneficiary', this.currentUserId]);
  }
 
  // ================= Payment =================
  submitPayment() {
    if (!this.selectedBeneficiary || !this.payment.amount || this.payment.amount <= 0) {
      return alert('Please select a beneficiary and enter a valid amount');
    }
 
    const paymentDto = new CreatePaymentDto(
      this.currentUserId,
      this.selectedBeneficiary.beneficiaryId,
      this.payment.amount,
      new Date()
    );
 
    this.paymentService.addPayment(paymentDto).subscribe({
      next: () => {
        alert('Payment successful');
        this.payment = { beneficiaryId: 0, amount: null, remarks: '' };
        this.selectedBeneficiary = undefined;
        this.loadTransactions();
      },
      error: (err) => console.error('Payment failed', err)
    });
  }
 
  // ================= Documents =================
  onFileSelected(event: any, type: 'aadhaar' | 'pan') {
    const file = event.target.files[0];
    if (type === 'aadhaar') this.aadhaarFile = file;
    else this.panFile = file;
  }
 
  uploadDocuments() {
    if (!this.aadhaarFile || !this.panFile) return alert('Upload Aadhaar and PAN');
 
    const uploadFile = (file: File, type: 'KYC' | 'IDCard') => {
      const form = new FormData();
      form.append('File', file);
      form.append('UserId', this.currentUserId.toString());
      form.append('DocumentType', type);
      return this.documentService.uploadDocument(form);
    };
 
    uploadFile(this.aadhaarFile, 'KYC').subscribe({ next: () => console.log('Aadhaar uploaded') });
    uploadFile(this.panFile, 'IDCard').subscribe({
      next: () => {
        alert('Aadhaar & PAN uploaded successfully');
        this.loadDocuments();
      }
    });
  }
 
  loadDocuments() {
    this.documentService.getAllDocuments().subscribe({
      next: res => (this.documents = res.filter(d => d.uploadedByUserId === this.currentUserId)),
      error: err => console.error(err)
    });
  }
 
  viewDocument(url: string) {
    window.open(url, '_blank');
  }
 
  downloadDocument(fileUrl: string, fileName: string) {
    this.documentService.downloadFile(fileUrl).subscribe(blob => {
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
      window.URL.revokeObjectURL(link.href);
    });
  }
 
  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
 
  toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
}
 
isSidebarCollapsed = false;
 
toggleSidebar() {
  this.isSidebarCollapsed = !this.isSidebarCollapsed;
}
submitSupportForm() {
  const templateParams = {
    name: this.support.name,       // this will replace {{name}}
    title: this.support.subject,   // this will replace {{title}}
    message: this.support.message,
    email: this.support.email
  };
 
  emailjs.send('service_z6u6vdn', 'template_lyhpnuk', templateParams, 'J9I5cEgOtasUVmRn2')
    .then((response:any) => {
       console.log('SUCCESS!', response.status, response.text);
       alert('Your support request has been submitted successfully.');
    }, (error:any) => {
       console.log('FAILED...', error);
       alert('Failed to submit your support request.');
    });
  }
// SALARY DISBURSMENT
 
 
submitSalaryDisbursement() {
  if (!this.salaryDisbursement.employeeId || !this.salaryDisbursement.batchId) {
    alert('Please select an employee and enter batch ID.');
    return;
  }

  const selectedEmp = this.employees.find(
    emp => emp.employeeId === this.salaryDisbursement.employeeId
  );

  if (!selectedEmp) {
    alert('Selected employee not found.');
    return;
  }

  const dto = new SalaryDisbursementDto(
    0,
    selectedEmp.employeeId,
    selectedEmp.employeeName,        // Corrected from 'name'
    selectedEmp.senderName || 'N/A', // Employer/client name
    selectedEmp.senderClientId,      // Employer/client ID
    selectedEmp.salary,
    new Date(),
    PaymentStatus.Pending,
    Number(this.salaryDisbursement.batchId) // Make sure batchId is number
  );

  console.log('Salary Disbursement DTO:', dto);

  this.salaryDisburse.addSalaryDisbursement(dto).subscribe({
    next: () => {
      alert('Salary Disbursement Initiated');
      this.getPastDisbursements();
      this.salaryDisbursement = { employeeId: null, amount: null, batchId: null };
    },
    error: err => console.error('Error disbursing salary:', err)
  });
}

onEmployeeChange(selectedEmpId: number | null): void {
  console.log('Selected Employee ID:', selectedEmpId);
  console.log('Filtered Employees:', this.filteredEmployees);

  if (selectedEmpId == null) {
    this.salaryDisbursement.amount = null;
    return;
  }

  const selectedEmp = this.filteredEmployees.find(emp => emp.employeeId === selectedEmpId);

  if (selectedEmp) {
    this.salaryDisbursement.amount = selectedEmp.salary;
    console.log('Selected Employee:', selectedEmp);
  } else {
    this.salaryDisbursement.amount = null;
    console.warn("⚠️ Employee not found for ID:", selectedEmpId);
    console.warn("Current filteredEmployees:", this.filteredEmployees);
  }
}




getPastDisbursements(): void {
  this.salaryDisburse.getAllSalaryDisbursements().subscribe({
    next: (data: SalaryDisbursement[]) => {
     this.pastDisbursements = data.map(d => new SalaryDisbursementDto(
  d.disbursementId,
  d.employeeId,
  d.employee?.clientName || 'Unknown',
  d.client?.name || 'Unknown', // senderName (string)
  d.clientId,                        // clientId (number)
  d.amount,
  new Date(d.date),
  d.status,
  d.batchId
));
console.log('Past Disbursements:', this.pastDisbursements);


      this.currentPage = 1;
      this.getPaginatedData();
    },
    error: err => console.error('Error loading past disbursements:', err)
  });
}


 // ================== Employee / Salary Logic ==================
currentClientId!: number;  // store it here

getClientIdForCurrentUser() {
  this.clientService.getAllClients().subscribe({
    next: (clients: ClientDto[]) => {
      const currentClient = clients.find(c => c.userId === this.currentUserId);
      if (currentClient) {
        this.currentClientId = currentClient.clientId;
        console.log('Current Client ID:', this.currentClientId);
      } else {
        console.warn('No client found for this user');
      }
    },
    error: (err: any) => console.error('Error fetching clients:', err)
  });
}


getEmployees(): void {
  this.employeeService.getAllEmployees().subscribe({
    next: (data: EmployeeDto[]) => {
      this.employees = data;
      console.log("Employees loaded:", this.employees);
    },
    error: err => console.error("Error fetching employees:", err)
  });
}

employeeDataLoaded = false;

loadEmployeesForCurrentClient(): void {
  if (this.employeeDataLoaded || !this.currentClientId) return;

  this.employeeService.getAllEmployees().subscribe({
    next: employees => {
      this.filteredEmployees = employees.filter(
        emp => emp.senderClientId === this.currentClientId
      );
      console.log("Filtered Employees:", this.filteredEmployees);
      this.employeeDataLoaded = true;
    },
    error: err => {
      console.error("Error fetching employees:", err);
      this.filteredEmployees = [];
      this.employeeDataLoaded = true;
    }
  });
}


get totalPages(): number {
  return Math.ceil(this.pastDisbursements.length / this.pageSize);
}

getPaginatedData(): void {
  const start = (this.currentPage - 1) * this.pageSize;
  const end = start + this.pageSize;
  this.paginatedDisbursements = this.pastDisbursements.slice(start, end);
}

goToPage(page: number): void {
  if (page >= 1 && page <= this.totalPages) {
    this.currentPage = page;
    this.getPaginatedData();
  }
}

prevPage(): void {
  if (this.currentPage > 1) {
    this.currentPage--;
    this.getPaginatedData();
  }
}

nextPage(): void {
  if (this.currentPage < this.totalPages) {
    this.currentPage++;
    this.getPaginatedData();
  }
}

}
 