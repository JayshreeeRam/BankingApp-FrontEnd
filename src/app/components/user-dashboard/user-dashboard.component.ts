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
import { ClientService } from '../../services/client.service';
import { ClientDto } from '../../DTOs/ClientDto';
import { ReportComponent } from '../report-component/report-component';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ReportComponent],
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  activeTab: string = 'home';
  showBeneficiaryList: boolean = false;
  profile: UserDto | any = { userId: 0, username: '', email: '', phoneNumber: '' };
  currentUserId!: number;
  currentClientId: number = 0;

  transactions: any[] = [];
  beneficiaries: BeneficiaryDto[] = [];
  selectedBeneficiary?: BeneficiaryDto;
  payment = { beneficiaryId: 0, amount: null as number | null, remarks: '' };
  documents: any[] = [];
  aadhaarFile: File | null = null;
  panFile: File | null = null;
  support = { name: '', email: '', subject: '', message: '' };
  filteredEmployees: EmployeeDto[] = [];
  employees: any[] = [];
  isEmployee: boolean = false;

// Transactions
   searchTransaction: string = '';
  transactionPage: number = 1;
  totalTransactionPages: number = 1;

  //beneficiary 

  searchBeneficiaryTerm: string = '';

//employees
  employeeSearchTerm: string = '';
  salaryEmployeeSearchTerm: string = '';

  salaryDisbursement: {
    employeeId: number | null;
    amount: number | null;
    batchId: string | null;
  } = { employeeId: null, amount: null, batchId: null };

  pageSize: number = 10;
  currentPage: number = 1;
  pastDisbursements: SalaryDisbursement[] = [];
  paginatedDisbursements: SalaryDisbursement[] = [];
  employeeDataLoaded = false;
  isSidebarCollapsed = false;

  constructor(
    private router: Router,
    private userService: UserService,
    private txService: TransactionService,
    private beneficiaryService: BeneficiaryService,
    private paymentService: PaymentService,
    private documentService: DocumentService,
    private authService: AuthService,
    private employeeService: EmployeeService,
    private salaryDisburse: SalaryDisbursementService,
    private clientService: ClientService,
  ) { }

  ngOnInit(): void {
    const userId = this.authService.getUserIdFromToken();
    if (!userId) {
      this.router.navigate(['/login']);
      return;
    }

    this.currentUserId = userId;
    console.log('Current User ID:', this.currentUserId);
    
    this.loadProfile(userId);
  }

  // Computed property to check if salary tab should be disabled
  get isSalaryTabDisabled(): boolean {
    return this.filteredEmployees.length === 0;
  }

  loadProfile(userId: number) {
    this.userService.getUserById(userId).subscribe({
      next: (user) => {
        this.profile = user;
        this.loadCurrentClient();
      },
      error: (err) => console.error('Error loading profile', err)
    });
  }

  loadCurrentClient() {
    this.clientService.getAllClients().subscribe({
      next: (clients) => {
        const client = clients.find(c => c.userId === this.currentUserId);
        if (client) {
          this.currentClientId = client.clientId;
          console.log('Found Client ID:', this.currentClientId);
          this.loadAllData();
        } else {
          console.error('No client found for current user');
          alert('No client account found for your user. Please contact support.');
        }
      },
      error: (err) => {
        console.error('Error loading clients:', err);
      }
    });
  }

  loadAllData() {
    this.loadBeneficiaries();
    this.loadTransactions();
    this.loadDocuments();
    this.loadEmployeesForCurrentClient();
    this.getPastDisbursements();
    this.getEmployees();
    
    console.log('Filtered Employees:', this.filteredEmployees);
    console.log("Current Client ID after loading:", this.currentClientId);
  }

  onTabChange(tab: string) {
    // Prevent switching to salary tab if no employees
    if (tab === 'salary' && this.isSalaryTabDisabled) {
      alert('No employees available for salary disbursement. Please add employees first.');
      return;
    }
    
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

  updateProfile() {
    this.userService.updateUser(this.currentUserId, this.profile).subscribe({
      next: () => alert('Profile updated successfully'),
      error: (err) => console.error(err)
    });
  }

  loadTransactions() {
    this.txService.getTransactionsByUserId(this.currentUserId).subscribe({
      next: (res) => {
        console.log('All transactions:', res);
        console.log('Current Client ID for transactions filter:', this.currentClientId);
        
        this.transactions = res.filter((tx) => {
          return tx.senderId === this.currentClientId || tx.receiverId === this.currentClientId;
        });
        
        console.log('Filtered transactions:', this.transactions);
      },
      error: (err) => console.error(err)
    });
  }
   private updateTransactionPagination() {
    const totalFiltered = this.transactions.filter(tx =>
      tx.senderName.toLowerCase().includes(this.searchTransaction.toLowerCase()) ||
      tx.receiverName.toLowerCase().includes(this.searchTransaction.toLowerCase())
    ).length;
    this.totalTransactionPages = Math.ceil(totalFiltered / this.pageSize) || 1;
  }

  get filteredTransactions(): any[] {
    const filtered = this.transactions.filter(tx =>
      tx.senderName.toLowerCase().includes(this.searchTransaction.toLowerCase()) ||
      tx.receiverName.toLowerCase().includes(this.searchTransaction.toLowerCase())
    );
    // Update page count
    this.totalTransactionPages = Math.ceil(filtered.length / this.pageSize) || 1;
    const start = (this.transactionPage - 1) * this.pageSize;
    return filtered.slice(start, start + this.pageSize);
  }

  goToTransactions() {
    this.activeTab = 'transactions';
  }

  loadBeneficiaries() {
    this.beneficiaryService.getAllBeneficiaries().subscribe({
      next: (res: BeneficiaryDto[]) => {
        // Filter by current client AND remove duplicates
        const seen = new Set();
        this.beneficiaries = res.filter((beneficiary) => {
          // Then remove duplicates based on accountNo + ifsccode
          const identifier = `${beneficiary.accountNo}-${beneficiary.ifsccode || 'na'}`;
          if (seen.has(identifier)) {
            return false;
          }
          seen.add(identifier);
          return true;
        });
        
        console.log('My Unique Beneficiaries:', this.beneficiaries);
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

  get filteredBeneficiaries() {
    return this.beneficiaries.filter(b => 
      b.bankName.toLowerCase().includes(this.searchBeneficiaryTerm.toLowerCase()) ||
      b.accountNo?.includes(this.searchBeneficiaryTerm)||
      b.ifsccode?.toLowerCase().includes(this.searchBeneficiaryTerm)
    );
  }

  submitPayment() {
  // First check if beneficiary and amount are valid
  if (!this.selectedBeneficiary || !this.payment.amount || this.payment.amount <= 0) {
    return alert('Please select a beneficiary and enter a valid amount');
  }

  // Check if client account is active
  if (!this.isClientAccountActive()) {
    return alert('Payment failed: Your account is not active. Please contact support for account verification.');
  }

  console.log('Current Client ID:', this.currentClientId);
  console.log('Selected Beneficiary ID:', this.selectedBeneficiary.beneficiaryId);

  const paymentDto = new CreatePaymentDto(
    this.currentClientId,
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
    error: (err) => {
      console.error('Payment failed', err);
      let errorMessage = 'Payment failed. ';
      if (err.error?.message) {
        errorMessage += err.error.message;
      } else if (err.status === 400) {
        errorMessage += 'Invalid client or beneficiary.';
      } else if (err.status === 500) {
        errorMessage += 'Server error. Please try again.';
      }
      alert(errorMessage);
    }
  });
}

isClientAccountActive(): boolean {
  // If you have client data loaded, check the status
  if (this.profile?.verificationStatus) {
    return this.profile.verificationStatus === 'Active' || this.profile.verificationStatus === 'Approved';
  }
  
  // If you don't have client data, you might need to fetch it
  console.warn('Client account status not available. Please ensure client data is loaded.');
  return false; // Default to false for safety
}

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

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  submitSupportForm() {
    const templateParams = {
      name: this.support.name,
      title: this.support.subject,
      message: this.support.message,
      email: this.support.email
    };

    emailjs.send('service_z6u6vdn', 'template_lyhpnuk', templateParams, 'J9I5cEgOtasUVmRn2')
      .then((response: any) => {
        console.log('SUCCESS!', response.status, response.text);
        alert('Your support request has been submitted successfully.');
      }, (error: any) => {
        console.log('FAILED...', error);
        alert('Failed to submit your support request.');
      });
  }

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
      selectedEmp.employeeName,
      selectedEmp.senderName || 'N/A',
      selectedEmp.senderClientId,
      selectedEmp.salary,
      new Date(),
      PaymentStatus.Pending,
      this.salaryDisbursement.batchId || ''
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
      this.salaryDisbursement.batchId = null;
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

get filteredEmployeesByName() {
  const term = this.employeeSearchTerm?.toLowerCase() || '';
  return this.employees.filter(emp =>
    emp.employeeName.toLowerCase().includes(term)
  );
}
  get filteredEmployeesForSalary(): EmployeeDto[] {
  const term = this.salaryEmployeeSearchTerm.toLowerCase();
  return this.filteredEmployees.filter(emp =>
    emp.employeeName.toLowerCase().includes(term)
  );
}

  getPastDisbursements(): void {
    this.salaryDisburse.getAllSalaryDisbursements().subscribe({
      next: (data: SalaryDisbursement[]) => {
        this.pastDisbursements = data
          .filter(d => d.clientId === this.currentClientId)
          .map(d => new SalaryDisbursementDto(
            d.disbursementId,
            d.employeeId,
            d.employee?.clientName || 'Unknown',
            d.client?.name || 'Unknown',
            d.clientId,
            d.amount,
            new Date(d.date),
            d.status,
            d.batchId
          ));

        console.log('Past Disbursements for current client:', this.pastDisbursements);
        this.currentPage = 1;
        this.getPaginatedData();
      },
      error: err => console.error('Error loading past disbursements:', err)
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