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
import emailjs from '@emailjs/browser';


@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
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

  constructor(
    private router: Router,
    private userService: UserService,
    private txService: TransactionService,
    private beneficiaryService: BeneficiaryService,
    private paymentService: PaymentService,
    private documentService: DocumentService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getUserIdFromToken();
    if (!userId) {
      this.router.navigate(['/login']);
      return;
    }
    this.currentUserId = userId;
    this.loadProfile(userId);
    this.loadBeneficiaries();
    this.loadTransactions();
    this.loadDocuments();
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
    this.txService.getTransactionsByAccount(this.currentUserId).subscribe({
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
}