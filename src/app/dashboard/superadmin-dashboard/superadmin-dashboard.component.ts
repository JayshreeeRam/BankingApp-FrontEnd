import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Admin {
  id: number;
  name: string;
  email: string;
  phone: string;
  editing?: boolean;
}

interface Bank {
  id: number;
  name: string;
  branch?: string;
  editing?: boolean;
}

interface Client {
  clientId: number;
  name: string;
  address?: string;
  accountNo: string;
  bankName: string;
  verificationStatus: string;
}

interface Payment {
  paymentId: number;
  clientName: string;
  beneficiaryName: string;
  amount: number;
  paymentDate: Date;
  paymentStatus: string;
}

@Component({
  selector: 'app-superadmin-dashboard',
  imports:[CommonModule,FormsModule],
  templateUrl: './superadmin-dashboard.component.html',
  styleUrls: ['./superadmin-dashboard.component.css']
  
})
export class SuperadminDashboardComponent implements OnInit {

 

  superadminName = 'SuperAdmin User';
  activeTab: string = 'admins';

  admins: Admin[] = [];
  newAdmin: Partial<Admin> = {};
  showAddAdminForm: boolean = false;

  banks: Bank[] = [];
  newBank: Partial<Bank> = {};
  showAddBankForm: boolean = false;

  clients: Client[] = [];
  selectedClient: Client | null = null;
  verificationStatuses = ['Pending', 'Verified', 'Rejected'];

  payments: Payment[] = [];

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


  constructor(private router: Router){}

  ngOnInit(): void {
    // For demo, load dummy data or fetch from backend API
    this.loadAdmins();
    this.loadBanks();
    this.loadClients();
    this.loadPayments();
  }

  // Admins management
  loadAdmins() {
    this.admins = [
      { id: 1, name: 'Admin One', email: 'admin1@example.com', phone: '1234567890' },
      { id: 2, name: 'Admin Two', email: 'admin2@example.com', phone: '0987654321' }
    ];
  }

  addAdmin() {
    if (!this.newAdmin.name || !this.newAdmin.email || !this.newAdmin.phone) return alert('Please fill all fields');
    const newId = this.admins.length ? Math.max(...this.admins.map(a => a.id)) + 1 : 1;
    this.admins.push({ id: newId, ...this.newAdmin } as Admin);
    this.newAdmin = {};
    this.showAddAdminForm = false;
  }

  cancelAddAdmin() {
    this.newAdmin = {};
    this.showAddAdminForm = false;
  }

  editAdmin(admin: Admin) {
    admin.editing = true;
  }

  saveAdmin(admin: Admin) {
    admin.editing = false;
    // TODO: Save changes to backend
  }

  cancelEditAdmin(admin: Admin) {
    admin.editing = false;
    // TODO: Reload admin data to discard changes if necessary
  }

  deleteAdmin(admin: Admin) {
    if (confirm(`Are you sure you want to delete admin "${admin.name}"?`)) {
      this.admins = this.admins.filter(a => a.id !== admin.id);
      // TODO: Delete from backend
    }
  }

  // Banks management
  loadBanks() {
    this.banks = [
      { id: 1, name: 'Bank A', branch: 'Main' },
      { id: 2, name: 'Bank B', branch: 'Downtown' }
    ];
  }

  addBank() {
    if (!this.newBank.name) return alert('Please enter bank name');
    const newId = this.banks.length ? Math.max(...this.banks.map(b => b.id)) + 1 : 1;
    this.banks.push({ id: newId, ...this.newBank } as Bank);
    this.newBank = {};
    this.showAddBankForm = false;
  }

  cancelAddBank() {
    this.newBank = {};
    this.showAddBankForm = false;
  }

  editBank(bank: Bank) {
    bank.editing = true;
  }

  saveBank(bank: Bank) {
    bank.editing = false;
    // TODO: Save changes to backend
  }

  cancelEditBank(bank: Bank) {
    bank.editing = false;
    // TODO: Reload bank data to discard changes if necessary
  }

  deleteBank(bank: Bank) {
    if (confirm(`Are you sure you want to delete bank "${bank.name}"?`)) {
      this.banks = this.banks.filter(b => b.id !== bank.id);
      // TODO: Delete from backend
    }
  }

  // Clients management
  loadClients() {
    this.clients = [
      { clientId: 101, name: 'Client A', address: '123 Street', accountNo: 'AC123', bankName: 'Bank A', verificationStatus: 'Pending' },
      { clientId: 102, name: 'Client B', address: '456 Avenue', accountNo: 'AC456', bankName: 'Bank B', verificationStatus: 'Verified' }
    ];
  }

  viewClientDetails(client: Client) {
    this.selectedClient = { ...client }; // clone for editing
  }

  updateClient() {
    if (!this.selectedClient) return;
    // Find and update client in array
    const index = this.clients.findIndex(c => c.clientId === this.selectedClient?.clientId);
    if (index > -1) {
      this.clients[index] = this.selectedClient;
      this.selectedClient = null;
      // TODO: Save to backend
    }
  }

  cancelClientEdit() {
    this.selectedClient = null;
  }

  // Payments management
  loadPayments() {
    this.payments = [
      { paymentId: 1001, clientName: 'Client A', beneficiaryName: 'Beneficiary X', amount: 1000, paymentDate: new Date('2023-09-01'), paymentStatus: 'Pending' },
      { paymentId: 1002, clientName: 'Client B', beneficiaryName: 'Beneficiary Y', amount: 2000, paymentDate: new Date('2023-09-10'), paymentStatus: 'Completed' }
    ];
  }

  updatePaymentStatus(payment: Payment) {
    const newStatus = prompt('Enter new status for payment (Pending, Completed, Failed):', payment.paymentStatus);
    if (newStatus && ['Pending', 'Completed', 'Failed'].includes(newStatus)) {
      payment.paymentStatus = newStatus;
      // TODO: Save to backend
    } else {
      alert('Invalid status');
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
  logout() {
  localStorage.clear(); // optional: clear session/token
  this.router.navigate(['/login']); // route to login page



  }}

