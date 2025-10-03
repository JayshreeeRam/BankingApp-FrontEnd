import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BankService } from '../../services/bank.service';
import { BankDto } from '../../DTOs/Bank.dto';
import { ClientService } from '../../services/client.service';
import { CreateClientDto } from '../../DTOs/CreateClientDto';
import { AccountType } from '../../Enum/AccountType 1';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment/environment';

@Component({
  selector: 'app-client-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './client.html',
  styleUrls: ['./client.css']
})
export class ClientDetailsComponent implements OnInit {
  clientForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  username: string = '';
  userFullName: string = '';
  userId: number = 0;
  email: string = '';
  phoneNumber: string = '';
  banks: BankDto[] = [];
  loadingBanks = true;

  constructor(
    private banksvc: BankService,
    private clientService: ClientService,
    private authService: AuthService,
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.clientForm = this.fb.group({
      selectedBankId: ['', [Validators.required]],
      accountType: ['Savings', [Validators.required]]
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      console.log('📥 Query params received:', params);
      
      this.username = params['username'] || '';
      this.userId = Number(params['userId']) || 0;
      this.userFullName = this.username;
      this.email = params['email'] || '';
      this.phoneNumber = params['phoneNumber'] || '';

      console.log('👤 User details from params:', {
        username: this.username,
        userId: this.userId,
        email: this.email,
        phoneNumber: this.phoneNumber
      });

      // If userId is 0, try to find it using multiple methods
      if (this.userId === 0) {
        this.findUserId();
      } else {
        this.loadBanks();
      }
    });
  }

  private findUserId() {
    console.log('🔄 Finding user ID...');
    
    // Method 1: Try to get from token (using your existing function)
    const tokenUserId = this.authService.getUserIdFromToken();
    if (tokenUserId && tokenUserId > 0) {
      console.log('✅ Found user ID from token:', tokenUserId);
      this.userId = tokenUserId;
      this.loadBanks();
      return;
    }

    // Method 2: Try to get from localStorage
    const storedUserId = localStorage.getItem('temp_userId');
    if (storedUserId && !isNaN(Number(storedUserId)) && Number(storedUserId) > 0) {
      console.log('✅ Found user ID from localStorage:', storedUserId);
      this.userId = Number(storedUserId);
      this.loadBanks();
      return;
    }

    // Method 3: Try to get from API by username
    this.getUserIdFromAPI();
  }

  private getUserIdFromAPI() {
    console.log('🔍 Searching for user in API...');
    
    this.http.get<any[]>(environment.backendURL + 'User').subscribe({
      next: (users) => {
        console.log('📋 Users from API:', users);
        const user = users.find(u => u.username === this.username);
        
        if (user && user.userId) {
          console.log('✅ Found user via API:', user);
          this.userId = user.userId;
          // Update localStorage with the found user ID
          localStorage.setItem('temp_userId', this.userId.toString());
        } else {
          console.error('❌ User not found in API');
          this.errorMessage = 'User not found. Please try registering again.';
        }
        
        this.loadBanks();
      },
      error: (error) => {
        console.error('❌ Error fetching users:', error);
        this.errorMessage = 'Unable to verify user. Please try again.';
        this.loadBanks();
      }
    });
  }

  loadBanks() {
    this.loadingBanks = true;
    this.banksvc.getAll().subscribe({
      next: (data: BankDto[]) => {
        this.banks = data;
        this.loadingBanks = false;
        console.log('🏦 Banks loaded:', data.length, 'banks');
        
        // If we still don't have a user ID after loading banks, show error
        if (this.userId === 0) {
          this.errorMessage = 'Unable to retrieve user information. The registration may have failed.';
        }
      },
      error: err => {
        console.error('Error loading banks:', err);
        this.loadingBanks = false;
        this.errorMessage = 'Failed to load banks. Please try again.';
      }
    });
  }

  onSubmit() {
    if (this.clientForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    if (this.userId === 0) {
      this.errorMessage = 'User information not available. Please try the registration process again.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const { selectedBankId, accountType } = this.clientForm.value;
    const selectedBank = this.banks.find(bank => bank.bankId == selectedBankId);

    const clientData: CreateClientDto = {
      bankId: Number(selectedBankId),
      // username: this.username,
      name: this.userFullName,
      address: selectedBank?.address || 'Not provided',
      accountType: accountType as AccountType,
      userId: this.userId, // This should now be the actual user ID
      accountNo: this.generateAccountNumber()
    };

    console.log('🔄 Creating client with data:', clientData);

    this.clientService.createClient(clientData).subscribe({
      next: (response) => {
        console.log('✅ Client creation successful:', response);
        this.isLoading = false;
        
        this.clearTemporaryData();
        this.router.navigate(['/login'], {
          queryParams: { 
            message: 'Registration completed successfully! Please login.',
            username: this.username
          }
        });
      },
      error: (error) => {
        console.error('❌ Client creation failed:', error);
        this.isLoading = false;
        
        if (error.status === 400) {
          this.errorMessage = 'Validation error: ' + (error.error?.title || 'Invalid user ID or data');
        } else if (error.status === 404) {
          this.errorMessage = 'User not found. Please try registering again.';
        } else {
          this.errorMessage = error.error?.message || 'Failed to create client account. Please try again.';
        }
      }
    });
  }

  private generateAccountNumber(): string {
    return 'TEMP' + Date.now().toString().slice(-8);
  }

  private clearTemporaryData() {
    const keys = [
      'temp_username',
      'temp_name', 
      'temp_userId',
      'temp_email',
      'temp_phoneNumber'
    ];
    
    keys.forEach(key => localStorage.removeItem(key));
    console.log('🧹 Cleared temporary data');
  }

  private markFormGroupTouched() {
    Object.keys(this.clientForm.controls).forEach(key => {
      this.clientForm.get(key)?.markAsTouched();
    });
  }

  getSelectedBankName(): string {
    const selectedId = this.selectedBankId?.value;
    const bank = this.banks.find(b => b.bankId == selectedId);
    return bank ? bank.name : '';
  }

  get selectedBankId() { return this.clientForm.get('selectedBankId'); }
  get accountType() { return this.clientForm.get('accountType'); }
}