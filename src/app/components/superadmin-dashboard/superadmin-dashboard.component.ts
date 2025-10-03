import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BankService } from '../../services/bank.service';
import { ClientService } from '../../services/client.service';
import { PaymentService } from '../../services/payment.service';
import { UserService } from '../../services/user.service';
import { UserDto } from '../../DTOs/UserDto';
import { BankDto } from '../../DTOs/Bank.dto';
import { ClientDto } from '../../DTOs/ClientDto';
import { UpdateClientDto } from '../../DTOs/UpdateClientDto';
import { PaymentDto } from '../../DTOs/PaymentDto';
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

@Component({
  selector: 'app-superadmin-dashboard',
  imports:[CommonModule,FormsModule,DatePipe,SuperAdminReportComponent],
  templateUrl: './superadmin-dashboard.component.html',
  styleUrls: ['./superadmin-dashboard.component.css']
})

export class SuperadminDashboardComponent implements OnInit {
  AccountStatus = AccountStatus; 
  PaymentStatus=PaymentStatus;
  superadminName = 'SuperAdmin User';
  activeTab: string = 'admins';
  sidebarOpen = true;

  

  admins: UserDto[] = [];
  banks: BankDto[] = [];
  
  clients: ClientUI[] = [];
  payments: PaymentDto[] = [];

  selectedClient: ClientUI | null = null;
  showAddBankForm: boolean = false;

  verificationStatuses = Object.values(AccountStatus); // For dropdown

newBank: CreateBankDto = {  name: '', address: '' };

  constructor(
    private userSvc: UserService,
    private bankSvc: BankService,
    private clientSvc: ClientService,
    private paymentSvc: PaymentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAdmins();
    this.loadBanks();
    this.loadPayments();
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
    console.log('Banks loaded:', data); // ✅ Check here that ifscCode exists
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
      this.banks.push(createdBank); // ✅ Push into correct array
      this.newBank = { name: '', address: '' }; // ✅ Reset form
      this.showAddBankForm = false;
    },
    error: err => console.error('Failed to create bank:', err)
  });
}


  // ================= Reports =================
 generateReport(){
  alert("report is genrated succesfully");
  console.log("report is genrated succesfully");
 }

  // ================= Payments =================
  loadPayments() {
    this.paymentSvc.getAllPayments().subscribe({
      next: data => (this.payments = data),
      error: err => console.error('Error loading payments:', err)
    });
  }

  updatePaymentStatus(payment: PaymentDto) {
    // implement payment status update logic here
    console.log('Update payment:', payment.paymentId);
  }

  // ================= Logout =================
  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
