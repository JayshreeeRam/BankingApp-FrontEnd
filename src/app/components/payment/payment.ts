import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BeneficiaryDto } from '../../DTOs/Beneficiary.dto';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.html',
  styleUrls: ['./payment.css'],
})
export class PaymentComponent implements OnInit {
  beneficiary?: BeneficiaryDto;
  amount: number = 0;

  constructor(private router: Router) {
    const state = this.router.getCurrentNavigation()?.extras.state as { beneficiary: BeneficiaryDto, amount: number };
    if (state) {
      this.beneficiary = state.beneficiary;
      this.amount = state.amount;
    }
  }

  ngOnInit(): void {}

  pay() {
    if (!this.beneficiary || this.amount <= 0) {
      alert('Invalid payment data');
      return;
    }

    // Call your backend API to process payment here
    alert(`Payment of ${this.amount} to ${this.beneficiary.bankName} successful!`);

    this.router.navigate(['/beneficiaries']);
  }
}
