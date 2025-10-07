import { PaymentStatus } from '../Enum/PaymentStatus 1';  

export class UpdatePaymentDto {
  beneficiaryId?: number;  
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
