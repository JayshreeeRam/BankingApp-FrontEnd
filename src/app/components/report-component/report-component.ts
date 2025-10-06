import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { BankService } from '../../services/bank.service';
import { ClientService } from '../../services/client.service';
import { FormBuilder, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserDto } from '../../DTOs/UserDto';

interface UserProfile {
  userId: number;
  username: string;
  email: string;
  phoneNumber: string;
  name?: string;
}

interface Employee {
  employeeId: number;
  employeeName: string;
  salary: number;
  bankName: string;
  bankId: number;
  employeeClientId: number;
}

interface Beneficiary {
  beneficiaryId: number;
  clientName: string;
  accountNo: string;
  bankName: string;
  ifscCode: string;
  clientId: number;
}

interface Transaction {
  transactionId?: number;
  senderName: string;
  receiverName?: string;
  amount: number;
  date: string;
  transactionDate?: string;
}

interface Disbursement {
  disbursementId: number;
  employeeName: string;
  senderName: string;
  clientId: number;
  amount: number;
  status: string;
  date: string;
  batchId: number;
  employeeId: number;
}

@Component({
  selector: 'app-report-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './report-component.html',
  styleUrls: ['./report-component.css']
})
export class ReportComponent implements OnInit {
  @Input() userId: number = 0;
  @Input() clientId: number = 0;
  @Input() isAdminView: boolean = false;

  profile: UserProfile = { userId: 0, username: '', email: '', phoneNumber: '' };
  employees: Employee[] = [];
  beneficiaries: Beneficiary[] = [];
  transactions: Transaction[] = [];
  pastDisbursements: Disbursement[] = [];
  
  isLoading = true;
  isGeneratingPDF = false;
  errorMessage = '';

  // Search properties for admin
  searchUserId: number = 0;
  searchClientId: number = 0;
  searchUserName: string = '';
  userList: UserDto[] = [];
  selectedUser: UserDto | null = null;
  selectedUserName: string = '';
  allUsers: UserDto[] = [];       // all users fetched from backend
filteredUsers: UserDto[] = []; 

  constructor(
    private http: HttpClient,
    private banksvc: BankService,
    private clientService: ClientService,
    private userService: UserService,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    // If it's admin view, don't auto-load data - show search interface
    if (this.isAdminView) {
    this.isLoading = false;
    this.loadAllUsers(); // Fetch all users for live search
    return;
  }

  this.loadCurrentUserData();
}

    // For user dashboard, get current user from auth service
  //   this.loadCurrentUserData();
  //     this.loadAllUsers();


 loadAllUsers() {
  this.userService.getAllUsers().subscribe(users => {
    this.allUsers = users;
    this.filteredUsers = users; // optional
  });
}

// Called on every input change
onSearchUserNameChange() {
  const term = this.searchUserName.trim().toLowerCase();

  if (!term) {
    this.filteredUsers = [];
    return;
  }

  this.filteredUsers = this.allUsers.filter(u =>
    u.username.toLowerCase().includes(term)
  );
}


// Use the existing selectUser method (update logic inside)
selectUser(user: UserDto) {
  this.selectedUser = user;
  this.selectedUserName = user.username;
  this.searchUserName = user.username;
  this.filteredUsers = []; // hide suggestions after selection
  this.userId = user.userId;
  this.loadReportData(); // optional: auto-load report after selection
}
  // Load current logged-in user data
  loadCurrentUserData() {
    this.isLoading = true;
    
    // Get current user ID from auth service token
    const currentUserId = this.authService.getUserIdFromToken();
    
    if (currentUserId && currentUserId > 0) {
      this.userId = currentUserId;
      console.log('🆔 Current User ID from token:', this.userId);
      this.loadReportData();
    } else {
      // Fallback: try to get user from localStorage
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        console.log('📝 Using stored user data');
        // For self-view, we still need the user ID from backend
        this.loadCurrentUserProfile();
      } else {
        this.errorMessage = 'Please log in to view your report.';
        this.isLoading = false;
      }
    }
  }

  // Load current user profile by getting all users and finding the matching one
  private loadCurrentUserProfile() {
    const currentUsername = localStorage.getItem('user');
    
    if (!currentUsername) {
      this.errorMessage = 'User information not found. Please log in again.';
      this.isLoading = false;
      return;
    }

    this.userService.getAllUsers().subscribe({
      next: (users) => {
        const currentUser = users.find(user => 
          user.username === currentUsername || 
          user.email === currentUsername
        );
        
        if (currentUser) {
          this.userId = currentUser.userId;
          console.log('✅ Found current user:', currentUser.username, 'ID:', this.userId);
          this.loadReportData();
        } else {
          this.errorMessage = 'Could not find your user profile.';
          this.isLoading = false;
        }
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.errorMessage = 'Failed to load user data.';
        this.isLoading = false;
      }
    });
  }

  // Admin search functionality
  onSearch() {
    if (!this.searchUserId && !this.searchClientId && !this.searchUserName) {
      this.errorMessage = 'Please enter User ID, Username, or Client ID to search';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.userList = [];

    // If searching by specific user ID, directly load that user
    if (this.searchUserId && !this.searchUserName && !this.searchClientId) {
      this.userService.getUserById(this.searchUserId).subscribe({
        next: (user) => {
          this.selectUser(user);
        },
        error: (error) => {
          console.error('Error loading user:', error);
          this.errorMessage = 'User not found with the provided ID';
          this.isLoading = false;
        }
      });
      return;
    }

    // For username search or combined search, get all users and filter
    this.userService.getAllUsers().subscribe({
      next: (allUsers) => {
        this.userList = allUsers.filter(user => {
          let matches = true;
          
          // Filter by User ID
          if (this.searchUserId && user.userId !== this.searchUserId) {
            matches = false;
          }
          
          // Filter by Username
          if (this.searchUserName && user.username && 
              !user.username.toLowerCase().includes(this.searchUserName.toLowerCase())) {
            matches = false;
          }
          
          // Note: clientId filtering would need additional logic based on your data structure
          // You might need to join with client data
          
          return matches;
        });
        
        if (this.userList.length === 0) {
          this.errorMessage = 'No users found matching your criteria';
        } else if (this.userList.length === 1) {
          this.selectUser(this.userList[0]);
        }
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.errorMessage = 'Failed to search users';
        this.isLoading = false;
      }
    });
  }

 

  // Reset search and clear data
  resetSearch() {
    this.searchUserId = 0;
    this.searchClientId = 0;
    this.searchUserName = '';
    this.userList = [];
    this.selectedUser = null;
    this.selectedUserName = '';
    this.clearData();
  }

  // Clear all report data
  clearData() {
    this.profile = { userId: 0, username: '', email: '', phoneNumber: '' };
    this.employees = [];
    this.beneficiaries = [];
    this.transactions = [];
    this.pastDisbursements = [];
  }

  get hasData(): boolean {
    return !!(this.profile?.username && this.profile.username !== 'N/A') ||
           this.employees.length > 0 ||
           this.beneficiaries.length > 0 ||
           this.transactions.length > 0 ||
           this.pastDisbursements.length > 0;
  }

  loadReportData() {
    if (!this.userId && !this.clientId) {
      this.errorMessage = 'Please provide a User ID or Client ID';
      this.isLoading = false;
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    
    console.log('🔄 Loading report data for:', {
      userId: this.userId,
      clientId: this.clientId,
      selectedUser: this.selectedUserName
    });
    
    Promise.all([
      this.loadUserProfile(),
      this.loadEmployees(),
      this.loadBeneficiaries(),
      this.loadTransactions(),
      this.loadDisbursements()
    ]).then(() => {
      this.isLoading = false;
      console.log('✅ All data loaded successfully');
    }).catch(error => {
      console.error('❌ Error loading report data:', error);
      this.isLoading = false;
      this.errorMessage = 'Failed to load report data. Please try again.';
    });
  }

  loadUserProfile(): Promise<void> {
    return new Promise((resolve, reject) => {
      const targetUserId = this.userId || this.clientId;
      
      if (!targetUserId) {
        this.setDefaultProfile();
        resolve();
        return;
      }

      console.log(`📡 Loading profile for ID: ${targetUserId}`);
      
      this.userService.getUserById(targetUserId).subscribe({
        next: (user) => {
          this.profile = {
            userId: user.userId || targetUserId,
            username: user.username || 'N/A',
            email: user.email || 'N/A',
            phoneNumber: user.phoneNumber || 'N/A',
            name: user.username || 'N/A'
          };
          console.log('✅ User profile loaded:', this.profile.username);
          resolve();
        },
        error: (error) => {
          console.error('❌ Error loading user profile:', error);
          this.setDefaultProfile();
          resolve();
        }
      });
    });
  }

  loadEmployees(): Promise<void> {
    return new Promise((resolve) => {
      let url = 'https://localhost:7144/api/Employee';
      
      if (this.userId || this.clientId) {
        url += `?userId=${this.userId}&clientId=${this.clientId}`;
      }
      
      this.http.get<Employee[]>(url).subscribe({
        next: (employees) => {
          console.log('✅ Employees loaded:', employees.length);
          this.employees = employees;
          resolve();
        },
        error: (error) => {
          console.error('Error loading employees:', error);
          this.employees = [];
          resolve();
        }
      });
    });
  }

  loadBeneficiaries(): Promise<void> {
    return new Promise((resolve) => {
      let url = 'https://localhost:7144/api/Beneficiary';
      
      if (this.userId || this.clientId) {
        url += `?userId=${this.userId}&clientId=${this.clientId}`;
      }
      
      this.http.get<Beneficiary[]>(url).subscribe({
        next: (beneficiaries) => {
          console.log('✅ Beneficiaries loaded:', beneficiaries.length);
          this.beneficiaries = beneficiaries;
          resolve();
        },
        error: (error) => {
          console.error('Error loading beneficiaries:', error);
          this.beneficiaries = [];
          resolve();
        }
      });
    });
  }

  loadTransactions(): Promise<void> {
    return new Promise((resolve) => {
      let url = 'https://localhost:7144/api/Transaction';
      
      if (this.userId || this.clientId) {
        url += `?userId=${this.userId}&clientId=${this.clientId}`;
      }
      
      this.http.get<Transaction[]>(url).subscribe({
        next: (transactions) => {
          console.log('✅ Transactions loaded:', transactions.length);
          this.transactions = transactions.map(trans => ({
            transactionId: trans.transactionId || 0,
            senderName: trans.senderName || 'N/A',
            receiverName: trans.receiverName || 'N/A',
            amount: trans.amount || 0,
            date: trans.date || trans.transactionDate || new Date().toISOString()
          }));
          resolve();
        },
        error: (error) => {
          console.error('Error loading transactions:', error);
          this.transactions = [];
          resolve();
        }
      });
    });
  }

  loadDisbursements(): Promise<void> {
    return new Promise((resolve) => {
      let url = 'https://localhost:7144/api/SalaryDisbursement';
      
      if (this.userId || this.clientId) {
        url += `?userId=${this.userId}&clientId=${this.clientId}`;
      }
      
      this.http.get<Disbursement[]>(url).subscribe({
        next: (disbursements) => {
          console.log('✅ Disbursements loaded:', disbursements.length);
          this.pastDisbursements = disbursements.map(dis => ({
            disbursementId: dis.disbursementId || 0,
            employeeName: dis.employeeName || 'N/A',
            senderName: dis.senderName || 'N/A',
            clientId: dis.clientId || 0,
            amount: dis.amount || 0,
            status: dis.status || 'N/A',
            date: dis.date || new Date().toISOString(),
            batchId: dis.batchId || 0,
            employeeId: dis.employeeId || 0
          }));
          resolve();
        },
        error: (error) => {
          console.error('Error loading disbursements:', error);
          this.pastDisbursements = [];
          resolve();
        }
      });
    });
  }

  private setDefaultProfile(index: number = 0) {
  this.profile = {
    userId: index + 1,
    username: 'N/A',
    email: 'N/A',
    phoneNumber: 'N/A',
    name: 'N/A'
  };
}

// Usage:
// this.setDefaultProfile(5); // userId will be 6
// this.setDefaultProfile(); // userId will be 1 (default parameter 0)

  generatePDF() {
    if (this.isGeneratingPDF) return;
    
    this.isGeneratingPDF = true;
    
    try {
      const doc = new jsPDF();
      let currentY = 20;

      // Title
      doc.setFontSize(18);
      doc.text('User Account Report', 14, currentY);
      currentY += 10;

      // Report Context
      doc.setFontSize(10);
      doc.setTextColor(100);
      if (this.isAdminView && this.selectedUserName) {
        doc.text(`Report for: ${this.selectedUserName} `, 14, currentY);
      } else {
        doc.text(`My Account Report - Generated on: ${new Date().toLocaleDateString()}`, 14, currentY);
      }
      currentY += 10;

      // User Profile Table
      autoTable(doc, {
        startY: currentY,
        head: [['User Information', 'Details']],
        body: [
          // ['User ID', this.profile.userId?.toString() || 'N/A'],
          ['Username', this.profile.username || 'N/A'],
          ['Email', this.profile.email || 'N/A'],
          ['Phone', this.profile.phoneNumber || 'N/A'],
          ['Full Name', this.profile.name || 'N/A'],
        ],
        theme: 'grid',
        styles: { fontSize: 12, cellPadding: 3 },
        headStyles: {
          fillColor: [22, 160, 133],
          textColor: 255,
          fontStyle: 'bold',
        }
      });

      currentY = (doc as any).lastAutoTable.finalY + 10;

      // Employee Info
      if (this.employees.length > 0) {
        doc.setFontSize(14);
        doc.text('Employee Information:', 14, currentY);
        currentY += 8;

        autoTable(doc, {
          startY: currentY,
          head: [['Employee Name', 'Bank', 'Salary']],
          body: this.employees.map(emp => [
            emp.employeeName || 'N/A',
            emp.bankName || 'N/A',
            `${emp.salary?.toLocaleString() || '0'}`,
          
           
          ]),
          styles: { fontSize: 10, cellPadding: 3 },
          headStyles: {
            fillColor: [52, 152, 219],
            textColor: 255,
            fontStyle: 'bold',
          }
        });

        currentY = (doc as any).lastAutoTable.finalY + 10;
      }

      // Summary Section
      doc.setFontSize(14);
      doc.text('Summary:', 14, currentY);
      currentY += 8;
      doc.setFontSize(12);
      doc.text(`Total Employees: ${this.employees.length}`, 14, currentY);
      currentY += 6;
      doc.text(`Total Beneficiaries: ${this.beneficiaries.length}`, 14, currentY);
      currentY += 6;
      doc.text(`Total Transactions: ${this.transactions.length}`, 14, currentY);
      currentY += 6;
      doc.text(`Total Disbursements: ${this.pastDisbursements.length}`, 14, currentY);
      currentY += 10;

      // Beneficiaries Table
      if (this.beneficiaries.length > 0) {
        doc.setFontSize(14);
        doc.text('Beneficiaries:', 14, currentY);
        currentY += 4;

        autoTable(doc, {
          startY: currentY,
          head: [['Beneficiary Name', 'Account No', 'Bank', 'IFSC Code']],
          body: this.beneficiaries.map(ben => [
            ben.clientName || 'N/A',
            ben.accountNo || 'N/A',
            ben.bankName || 'N/A',
            ben.ifscCode || 'N/A'
          ]),
          styles: { fontSize: 10, cellPadding: 3 },
          headStyles: {
            fillColor: [155, 89, 182],
            textColor: 255,
            fontStyle: 'bold',
          }
        });

        currentY = (doc as any).lastAutoTable.finalY + 10;
      }

      // Transactions Table
      if (this.transactions.length > 0) {
        doc.setFontSize(14);
        doc.text('Transactions:', 14, currentY);
        currentY += 4;

        autoTable(doc, {
          startY: currentY,
          head: [['Sender', 'Receiver', 'Amount', 'Date']],
          body: this.transactions.map(trans => [
            trans.senderName || 'N/A',
            trans.receiverName || 'N/A',
            `${trans.amount?.toLocaleString() || '0'}`,
            new Date(trans.date).toLocaleDateString()
          ]),
          styles: { fontSize: 10, cellPadding: 3 },
          headStyles: {
            fillColor: [230, 126, 34],
            textColor: 255,
            fontStyle: 'bold',
          }
        });

        currentY = (doc as any).lastAutoTable.finalY + 10;
      }

      // Disbursements Table
      if (this.pastDisbursements.length > 0) {
        doc.setFontSize(14);
        doc.text('Salary Disbursements:', 14, currentY);
        currentY += 4;

        autoTable(doc, {
          startY: currentY,
          head: [['Employee', 'Sender', 'Amount', 'Status', 'Date','Batch/Dept']],
          body: this.pastDisbursements.map(dis => [
            dis.employeeName || 'N/A',
            dis.senderName || 'N/A',
            `${dis.amount?.toLocaleString() || '0'}`,
            dis.status || 'N/A',
            new Date(dis.date).toLocaleDateString(),
            dis.batchId?.toString() || 'N/A'
          ]),
          styles: { fontSize: 10, cellPadding: 3 },
          headStyles: {
            fillColor: [231, 76, 60],
            textColor: 255,
            fontStyle: 'bold',
          }
        });
      }

      // Final Save
      const fileName = this.isAdminView 
        ? `${this.selectedUserName || 'user'}_report_${new Date().toISOString().split('T')[0]}.pdf`
        : `my_report_${new Date().toISOString().split('T')[0]}.pdf`;
      
      doc.save(fileName);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      this.errorMessage = 'Failed to generate PDF. Please try again.';
    } finally {
      this.isGeneratingPDF = false;
    }
  }

  refreshData() {
    this.loadReportData();
  }
}