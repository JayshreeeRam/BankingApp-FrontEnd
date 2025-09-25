import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent {
  activeTab: string = 'home';

  constructor(private router: Router) {}

  // File uploads
  aadhaarFile: File | null = null;
  panFile: File | null = null;
  aadhaarPreview: string | ArrayBuffer | null = null;
  panPreview: string | ArrayBuffer | null = null;

  // Profile Info (from User.cs)
  profile = {
    Username: 'EdwinGeorge',
    Email: 'edwingeorge@email.com',
    PhoneNumber: '9876543210'
  };

  // Transactions (from Transaction.cs)
  transactions = [
    {
       id: 1,
       sender: 'Company ABC',
       receiver: 'John Doe',
       amount: 10000,
       status: 'Pending'
    },
    {
        id: 1,
       sender: 'Company ABC',
       receiver: 'John Doe',
       amount: 10000,
       status: 'Pending'
    },
    {
        id: 1,
       sender: 'Company ABC',
       receiver: 'John Doe',
       amount: 10000,
       status: 'Pending'
    }
  ];

  // Support form
  support = {
    subject: '',
    message: ''
  };

  // Payment form (from Payment.cs)
  payment = {
    beneficiaryId: '',
    amount: null as number | null,
    remarks: ''
  };

  beneficiaries = [
    { id: 1, bankName: 'SBI', accountNo: 'XXXXXX1234' },
    { id: 2, bankName: 'ICICI', accountNo: 'XXXXXX5678' }
  ];



  // File upload handlers
  onFileSelected(event: any, type: 'aadhaar' | 'pan') {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (type === 'aadhaar') {
        this.aadhaarFile = file;
        this.aadhaarPreview = reader.result;
      } else {
        this.panFile = file;
        this.panPreview = reader.result;
      }
    };
    reader.readAsDataURL(file);
  }

  uploadDocuments() {
    if (this.aadhaarFile && this.panFile) {
      alert('Documents ready to upload!');
      // TODO: Integrate with backend API
    } else {
      alert('Please upload both Aadhaar and PAN documents.');
    }
  }

  updateProfile() {
    if (this.profile.Username && this.profile.Email && this.profile.PhoneNumber) {
      alert('Profile updated successfully!');
      // TODO: Connect to backend API to update user profile
    } else {
      alert('Please fill all profile details.');
    }
  }

  submitSupport() {
    if (this.support.subject && this.support.message) {
      alert('Your message has been sent. Our team will contact you shortly.');
      this.support = { subject: '', message: '' };
    } else {
      alert('Please fill in both subject and message.');
    }
  }

  submitPayment() {
    if (!this.payment.beneficiaryId || !this.payment.amount || this.payment.amount <= 0) {
      alert("Please complete all required fields.");
      return;
    }

    alert('Payment submitted successfully! (Mock)');

  }
    logout() {
  localStorage.clear(); // optional: clear session/token
  this.router.navigate(['/login']); // route to login page



  }}
