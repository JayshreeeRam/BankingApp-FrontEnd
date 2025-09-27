import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BeneficiaryService } from '../../services/beneficiary.service';
import { BankService } from '../../services/bank.service';
import { BeneficiaryDto } from '../../DTOs/Beneficiary.dto';
import { BankDto } from '../../DTOs/Bank.dto';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-create-beneficary-component',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './create-beneficary-component.html',
  styleUrl: './create-beneficary-component.css'
})
export class CreateBeneficaryComponent implements OnInit{

  clientId: number = 0;

  banks: BankDto[] = [];
  bankName: string = '';
  ifscCode: string = '';
  accountNo: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private beneficiaryService: BeneficiaryService,
    private bankService: BankService
  ) {}

  ngOnInit(): void {
    // Get clientId from route
    const idParam = this.route.snapshot.paramMap.get('clientId');
    this.clientId = idParam ? +idParam : 0;

    // Load all banks
    this.loadBanks();
  }

  loadBanks() {
    this.bankService.getAll().subscribe({
      next: (data: BankDto[]) => {
        this.banks = data;
      },
      error: err => console.error('Error loading banks', err)
    });
  }

  onBankSelect(event: Event) {
    const target = event.target as HTMLSelectElement | null;
    if (!target) return;

    const bankId = Number(target.value);
    const selectedBank = this.banks.find(b => b.bankId === bankId);
    if (selectedBank) {
      this.bankName = selectedBank.name;
      this.ifscCode = selectedBank.ifscCode;
    }
  }

  onCreate() {
    if (!this.clientId) {
      alert('Client ID is required');
      return;
    }

    const newBeneficiary: BeneficiaryDto = {
      beneficiaryId: 0, // Backend will assign
      bankName: this.bankName,
      accountNo: this.accountNo,
      ifscCode: this.ifscCode,
      clientId: this.clientId
    };

    this.beneficiaryService.createBeneficiary(newBeneficiary).subscribe({
      next: () => {
        alert('Beneficiary created successfully!');
        this.router.navigate(['/dashboard/user']); // go back to dashboard
      },
      error: err => console.error('Error creating beneficiary', err)
    });
  }
}
