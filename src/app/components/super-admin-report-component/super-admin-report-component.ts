
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { UserService } from '../../services/user.service';
import { BankService } from '../../services/bank.service';
import { ClientService } from '../../services/client.service';
import { TransactionService } from '../../services/transaction.service';
import { TransactionDto } from '../../DTOs/TransactionDto';
import { ClientDto } from '../../DTOs/ClientDto';
import { Bank } from '../../Models/Bank';
import { BankDto } from '../../DTOs/Bank.dto';

// interface Bank {
//   bankId: number;
//   bankName: string;
//   address: string;
//   ifsccode: string;
//   contactInfo: string;
//   isActive: boolean;
// }

interface AdminUser {
  userId: number;
  username: string;
  email: string;
  phoneNumber: string;
  name?: string;
  role: string;
}

interface Transaction {
  transactionId: number;
  amount: number;
  date: string;
  status: string;
}

interface Client {
  clientId: number;
  clientName: string;
  email: string;
  phoneNumber: string;
}

@Component({
  selector: 'app-super-admin-report-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './super-admin-report-component.html',
  styleUrls: ['./super-admin-report-component.css']
})



export class SuperAdminReportComponent implements OnInit {
  // Statistics
  totalTransactions: number = 0;
  totalClients: number = 0;
  totalBanks: number = 0;
  totalAdmins: number = 0;
  totalUsers: number = 0;
  totalTransactionAmount: number = 0;
  activeBanks: number = 0;
  todayTransactions: number = 0;

  // Data Arrays
  banks: BankDto[] = [];
  admins: AdminUser[] = [];
  transactions: TransactionDto[] = [];
  clients: ClientDto[] = [];
  allUsers: any[] = [];

  // UI State
  isLoading: boolean = true;
  isGeneratingPDF: boolean = false;
  errorMessage: string = '';
  showBankDetails: boolean = true;
  showAdminDetails: boolean = true;

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private bankService: BankService,
    private clientService: ClientService,
    private transactionService: TransactionService
  ) {}

  ngOnInit() {
    this.loadReportData();
  }

  get hasData(): boolean {
    return this.totalTransactions > 0 || 
           this.totalClients > 0 || 
           this.totalBanks > 0 || 
           this.totalAdmins > 0;
  }

  loadReportData() {
    this.isLoading = true;
    this.errorMessage = '';

    Promise.all([
      this.loadBanks(),
      this.loadUsers(),
      this.loadTransactions(),
      this.loadClients()
    ]).then(() => {
      this.calculateStatistics();
      this.isLoading = false;
      console.log('Super Admin report data loaded successfully');
    }).catch(error => {
      console.error('Error loading super admin report:', error);
      this.errorMessage = 'Failed to load report data. Please try again.';
      this.isLoading = false;
    });
  }

  loadBanks(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.bankService.getAll().subscribe({
        next: (banks:any) => {
          this.banks = banks;
          resolve();
        },
        error: (error:any) => {
          console.error('Error loading banks:', error);
          // Fallback to direct HTTP call if service method doesn't exist
          this.http.get<Bank[]>('https://localhost:7144/api/Bank').subscribe({
            next: (banks) => {
              this.banks = banks;
              resolve();
            },
            error: (error) => {
              console.error('Error loading banks via HTTP:', error);
              resolve(); // Resolve anyway to continue loading other data
            }
          });
        }
      });
    });
  }

  loadUsers(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.userService.getAllUsers().subscribe({
        next: (users) => {
          this.allUsers = users;
          // Filter admin users - adjust the condition based on your role system
          this.admins = users.filter(user => 
            user.userRole === 'Admin' || 
            user.username?.toLowerCase().includes('admin') ||
            this.isUserAdmin(user) // Custom logic to identify admins
          ).map(user => ({
            userId: user.userId,
            username: user.username,
            email: user.email,
            phoneNumber: user.phoneNumber,
            name:  user.username,
            role: user.userRole || 'Admin'
          }));
          resolve();
        },
        error: (error) => {
          console.error('Error loading users:', error);
          resolve(); // Resolve anyway
        }
      });
    });
  }

  loadTransactions(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.transactionService.getAllTransactions().subscribe({
        next: (transactions) => {
          this.transactions = transactions;
          resolve();
        },
        error: (error) => {
          console.error('Error loading transactions:', error);
          // Fallback to direct HTTP call
          this.http.get<TransactionDto[]>('https://localhost:7144/api/Transaction').subscribe({
            next: (transactions) => {
              this.transactions = transactions;
              resolve();
            },
            error: (error) => {
              console.error('Error loading transactions via HTTP:', error);
              resolve();
            }
          });
        }
      });
    });
  }

  loadClients(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.clientService.getAllClients().subscribe({
        next: (clients) => {
          this.clients = clients;
          resolve();
        },
        error: (error) => {
          console.error('Error loading clients:', error);
          // Fallback to direct HTTP call
          this.http.get<ClientDto[]>('https://localhost:7144/api/Client').subscribe({
            next: (clients) => {
              this.clients = clients;
              resolve();
            },
            error: (error) => {
              console.error('Error loading clients via HTTP:', error);
              resolve();
            }
          });
        }
      });
    });
  }

  calculateStatistics() {
    // Basic counts
    this.totalTransactions = this.transactions.length;
    this.totalClients = this.clients.length;
    this.totalBanks = this.banks.length;
    this.totalAdmins = this.admins.length;
    this.totalUsers = this.allUsers.length;

    // Additional calculations
    this.totalTransactionAmount = this.transactions
      .reduce((sum, transaction) => sum + (transaction.amount || 0), 0);
    
    this.activeBanks = this.banks.length;
    
    const today = new Date().toDateString();
    this.todayTransactions = this.transactions.filter(transaction => 
      new Date(transaction.transactionDate).toDateString() === today
    ).length;
  }

  // Helper method to identify admin users
  private isUserAdmin(user: any): boolean {
    // Adjust this logic based on your user role system
    return user.role === 'Admin' || 
           user.role === 'Administrator' ||
           (user.role && user.role.toLowerCase().includes('admin')) ||
           (user.username && user.username.toLowerCase().includes('admin'));
  }

  toggleBankDetails() {
    this.showBankDetails = !this.showBankDetails;
  }

  toggleAdminDetails() {
    this.showAdminDetails = !this.showAdminDetails;
  }

  generatePDF() {
    if (this.isGeneratingPDF) return;
    
    this.isGeneratingPDF = true;

    try {
      const doc = new jsPDF();
      let currentY = 20;

      // Title
      doc.setFontSize(20);
      doc.setTextColor(40, 40, 40);
      doc.text('Super Admin Dashboard Report', 14, currentY);
      currentY += 10;

      // Date
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, currentY);
      currentY += 15;

      // Statistics Section
      doc.setFontSize(16);
      doc.setTextColor(40, 40, 40);
      doc.text('System Overview', 14, currentY);
      currentY += 10;

      // Statistics Table
      autoTable(doc, {
        startY: currentY,
        head: [['Metric', 'Count']],
        body: [
          ['Total Transactions', this.totalTransactions.toString()],
          ['Total Clients', this.totalClients.toString()],
          ['Total Banks', this.totalBanks.toString()],
          ['Admin Users', this.totalAdmins.toString()],
          ['Total Users', this.totalUsers.toString()],
          ['Total Transaction Amount', `₹${this.totalTransactionAmount.toLocaleString()}`],
          ['Active Banks', this.activeBanks.toString()],
          ["Today's Transactions", this.todayTransactions.toString()],
        ],
        theme: 'grid',
        styles: { fontSize: 12, cellPadding: 4 },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: 'bold',
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245]
        }
      });

      currentY = (doc as any).lastAutoTable.finalY + 15;

      // Banks Section
      if (this.banks.length > 0) {
        doc.setFontSize(16);
        doc.text(`Banks Information (${this.banks.length} Banks)`, 14, currentY);
        currentY += 10;

        autoTable(doc, {
          startY: currentY,
          head: [['Bank ID', 'Bank Name', 'Address', 'IFSC Code', 'Contact', 'Status']],
          body: this.banks.map(bank => [
            bank.bankId.toString(),
            bank.name,
            bank.address || 'N/A',
            bank.ifsccode || 'N/A',
            // bank.contactInfo || 'N/A',
            // bank.isActive ? 'Active' : 'Inactive'
          ]),
          styles: { fontSize: 10, cellPadding: 3 },
          headStyles: {
            fillColor: [39, 174, 96],
            textColor: 255,
            fontStyle: 'bold',
          },
          columnStyles: {
            0: { cellWidth: 20 },
            1: { cellWidth: 30 },
            2: { cellWidth: 40 },
            3: { cellWidth: 25 },
            4: { cellWidth: 30 },
            5: { cellWidth: 20 }
          }
        });

        currentY = (doc as any).lastAutoTable.finalY + 15;
      }

      // Admins Section
      if (this.admins.length > 0) {
        doc.setFontSize(16);
        doc.text(`Admin Users (${this.admins.length} Admins)`, 14, currentY);
        currentY += 10;

        autoTable(doc, {
          startY: currentY,
          head: [['User ID', 'Username', 'Name', 'Email', 'Phone', 'Role']],
          body: this.admins.map(admin => [
            admin.userId.toString(),
            admin.username,
            admin.name || 'N/A',
            admin.email,
            admin.phoneNumber || 'N/A',
            admin.role
          ]),
          styles: { fontSize: 10, cellPadding: 3 },
          headStyles: {
            fillColor: [155, 89, 182],
            textColor: 255,
            fontStyle: 'bold',
          },
          columnStyles: {
            0: { cellWidth: 20 },
            1: { cellWidth: 25 },
            2: { cellWidth: 25 },
            3: { cellWidth: 40 },
            4: { cellWidth: 30 },
            5: { cellWidth: 20 }
          }
        });
      }

      // Save PDF
      const fileName = `super_admin_report_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);

    } catch (error) {
      console.error('Error generating PDF:', error);
      this.errorMessage = 'Failed to generate PDF report.';
    } finally {
      this.isGeneratingPDF = false;
    }
  }

  exportToExcel() {
    // Simple CSV export implementation
    let csvContent = 'Super Admin Report\n\n';
    
    // Statistics
    csvContent += 'Statistics\n';
    csvContent += 'Metric,Count\n';
    csvContent += `Total Transactions,${this.totalTransactions}\n`;
    csvContent += `Total Clients,${this.totalClients}\n`;
    csvContent += `Total Banks,${this.totalBanks}\n`;
    csvContent += `Admin Users,${this.totalAdmins}\n`;
    csvContent += `Total Users,${this.totalUsers}\n`;
    csvContent += `Total Transaction Amount,₹${this.totalTransactionAmount}\n`;
    csvContent += `Active Banks,${this.activeBanks}\n`;
    csvContent += `Today's Transactions,${this.todayTransactions}\n\n`;

    // Banks
    csvContent += 'Banks\n';
    csvContent += 'Bank ID,Bank Name,Address,IFSC Code,Contact Info,Status\n';
    this.banks.forEach(bank => {
      csvContent += `${bank.bankId},"${bank.name}","${bank.address || ''}","${bank.ifsccode }'\n`;
    });
    csvContent += '\n';

    // Admins
    csvContent += 'Admin Users\n';
    csvContent += 'User ID,Username,Name,Email,Phone Number,Role\n';
    this.admins.forEach(admin => {
      csvContent += `${admin.userId},"${admin.username}","${admin.name || ''}","${admin.email}","${admin.phoneNumber || ''}","${admin.role}"\n`;
    });

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `super_admin_report_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  refreshData() {
    this.loadReportData();
  }
}