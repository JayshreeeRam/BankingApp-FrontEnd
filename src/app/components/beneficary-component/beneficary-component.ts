import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BeneficiaryService } from '../../services/beneficiary.service';
import { BeneficiaryDto } from '../../DTOs/Beneficiary.dto';

@Component({
  selector: 'app-beneficary-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './beneficary-component.html',
  styleUrls: ['./beneficary-component.css']
})
export class BeneficaryComponent implements OnInit {
  clientId: number = 1; 
  beneficiaries: BeneficiaryDto[] = [];
  selectedBeneficiary?: BeneficiaryDto;
  paymentAmount: number = 0;

  constructor(
    private beneficiaryService: BeneficiaryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadBeneficiaries();
  }

loadBeneficiaries() {
  this.beneficiaryService.getBeneficiariesByUser(this.clientId).subscribe({
    next: (data) => {
      this.beneficiaries = data;
      console.log('Loaded beneficiaries:', this.beneficiaries);
    },
    error: (err) => console.error(err)
  });
}



 onSelectBeneficiary(event: any) {
  this.selectedBeneficiary = event.target.value;
  console.log('Selected beneficiary:', this.selectedBeneficiary);
}


  onDeleteBeneficiary(id: number) {
    this.beneficiaryService.deleteBeneficiary(id).subscribe(() => {
      this.loadBeneficiaries();
      this.selectedBeneficiary = undefined;
    });
  }

  deleteSelectedBeneficiary() {
    if (this.selectedBeneficiary) {
      this.onDeleteBeneficiary(this.selectedBeneficiary.beneficiaryId);
    } else {
      alert('No beneficiary selected');
    }
  }

  onCreateNewBeneficiary() {
    this.router.navigate(['/create-beneficiary', this.clientId]);
  }

  onMakePayment() {
    if (this.selectedBeneficiary && this.paymentAmount > 0) {
      this.router.navigate(['/payment'], {
        state: {
          beneficiary: this.selectedBeneficiary,
          amount: this.paymentAmount
        }
      });
    } else {
      alert('Select a beneficiary and enter amount');
    }
  }
}
