import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BankService } from '../../services/bank.service';
import { ClientService } from '../../services/client.service';
import { PaymentService } from '../../services/payment.service';
import { UserService } from '../../services/user.service';
import { BeneficiaryService } from '../../services/beneficiary.service';
import { UserDto } from '../../DTOs/UserDto';
import { BankDto } from '../../DTOs/Bank.dto';
import { ClientDto } from '../../DTOs/ClientDto';
import { UpdateClientDto } from '../../DTOs/UpdateClientDto';
import { PaymentDto } from '../../DTOs/PaymentDto';
import { BeneficiaryDto } from '../../DTOs/Beneficiary.dto';
import { AccountStatus } from '../../Enum/AccountStatus 1';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaymentStatus } from '../../Enum/PaymentStatus 1';
import { CreateBankDto } from '../../DTOs/CreateBankDto';
import { SuperAdminReportComponent } from '../super-admin-report-component/super-admin-report-component';

// ✅ UI model for displaying clients
interface ClientUI {
  clientId: number;
  name: string;
  address?: string;
  accountNo: string;
  bankName: string;
  verificationStatus: AccountStatus;
}

// ✅ Extended Payment interface with names
interface PaymentWithNames extends PaymentDto {
  clientName: string;
  beneficiaryName: string;
}

@Component({
  selector: 'app-superadmin-dashboard',
  imports: [CommonModule, FormsModule, DatePipe, SuperAdminReportComponent],
  templateUrl: './superadmin-dashboard.component.html',
  styleUrls: ['./superadmin-dashboard.component.css']
})
export class SuperadminDashboardComponent implements OnInit {
  AccountStatus = AccountStatus; 
  PaymentStatus = PaymentStatus;
  superadminName = 'SuperAdmin User';
  activeTab: string = 'admins';
  sidebarOpen = true;

  admins: UserDto[] = [];
  banks: BankDto[] = [];
  clients: ClientUI[] = [];
  payments: PaymentWithNames[] = [];
  allClients: ClientDto[] = []; // Store all clients for name lookup
  allBeneficiaries: BeneficiaryDto[] = []; // Store all beneficiaries for name lookup

  selectedClient: ClientUI | null = null;
  showAddBankForm: boolean = false;

  verificationStatuses = Object.values(AccountStatus); // For dropdown

  newBank: CreateBankDto = { name: '', address: '', ifsccode: '' };

  constructor(
    private userSvc: UserService,
    private bankSvc: BankService,
    private clientSvc: ClientService,
    private paymentSvc: PaymentService,
    private beneficiarySvc: BeneficiaryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAdmins();
    this.loadBanks();
    this.loadClientsAndBeneficiaries(); // Load clients and beneficiaries first
  }

  // ================= Load Clients and Beneficiaries =================
  loadClientsAndBeneficiaries() {
    // Load clients
    this.clientSvc.getAllClients().subscribe({
      next: (clients: ClientDto[]) => {
        this.allClients = clients;
        console.log('Clients loaded:', this.allClients);
        
        // Load beneficiaries
        this.beneficiarySvc.getAllBeneficiaries().subscribe({
          next: (beneficiaries: BeneficiaryDto[]) => {
            this.allBeneficiaries = beneficiaries;
            console.log('Beneficiaries loaded:', this.allBeneficiaries);
            
            // Now load payments with names
            this.loadPayments();
          },
          error: err => console.error('Error loading beneficiaries:', err)
        });
      },
      error: err => console.error('Error loading clients:', err)
    });
  }

  // ================= Helper Methods for Names =================
  getClientNameById(clientId: number): string {
    const client = this.allClients.find(c => c.clientId === clientId);
    return client ? client.name : 'Unknown Client';
  }

 getBeneficiaryNameById(beneficiaryId: number): string {
  const beneficiary = this.allBeneficiaries.find(b => b.beneficiaryId === beneficiaryId);
  
  if (beneficiary) {
    // Get the client name who owns this beneficiary
    const client = this.allClients.find(c => c.clientId === beneficiary.clientId);
    const clientName = client ? client.name : 'Unknown Client';
    
    // Return format: "Client Name - Bank Name - Account No"
    return `${clientName} - ${beneficiary.bankName} - ${beneficiary.accountNo}`;
  }
  
  return 'Unknown Beneficiary';
}

  // ================= Admins =================
  loadAdmins() {
    this.userSvc.getAllUsers().subscribe({
      next: users => {
        this.admins = users.filter(u => u.userRole === 'Admin');
      },
      error: err => console.error('Error loading admins:', err)
    });
  }

  // ================= Banks =================
  loadBanks() {
    this.bankSvc.getAll().subscribe({
      next: (data: BankDto[]) => {
        this.banks = data;
        console.log('Banks loaded:', data);
      },
      error: err => console.error('Error loading banks:', err)
    });
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  getBankName(bankId: number): string {
    const bank = this.banks.find(b => b.bankId === bankId);
    return bank ? bank.name : 'N/A';
  }

  addBank() {
    this.bankSvc.create(this.newBank).subscribe({
      next: (createdBank: BankDto) => {
        this.banks.push(createdBank);
        this.newBank = { name: '', address: '', ifsccode: '' };
        this.showAddBankForm = false;
      },
      error: err => console.error('Failed to create bank:', err)
    });
  }

  // ================= Reports =================
  generateReport() {
    alert("Report generated successfully");
    console.log("Report generated successfully");
  }

  // ================= Payments =================
  loadPayments() {
    this.paymentSvc.getAllPayments().subscribe({
      next: (data: PaymentDto[]) => {
        console.log('Fetching all payments for superadmin...');
        this.payments = data.map(p => ({
          ...p,
          clientName: this.getClientNameById(p.clientId),
          beneficiaryName: this.getBeneficiaryNameById(p.beneficiaryId)
        }));
        console.log('Payments with names:', this.payments);
      },
      error: err => console.error('Error loading payments:', err)
    });
  }

  updatePaymentStatus(payment: PaymentWithNames) {
    // implement payment status update logic here
    console.log('Update payment:', payment.paymentId);
  }

  // ================= Logout =================
  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}