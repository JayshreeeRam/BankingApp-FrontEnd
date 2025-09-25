import { PaymentStatus } from '../Enum/PaymentStatus 1';  // Assuming PaymentStatus is an enum

export class UpdatePaymentDto {
  beneficiaryId?: number;  // Optional, can be null or not provided
  amount: number;
  paymentDate: Date;
  paymentStatus: PaymentStatus;

  constructor(
    amount: number,
    paymentDate: Date,
    paymentStatus: PaymentStatus,
    beneficiaryId?: number
  ) {
    this.amount = amount;
    this.paymentDate = paymentDate;
    this.paymentStatus = paymentStatus;
    this.beneficiaryId = beneficiaryId;
  }
}
