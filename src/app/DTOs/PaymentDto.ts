export enum PaymentStatus {
  Pending = 'Pending',
  Completed = 'Completed',
  Failed = 'Failed',
  Canceled = 'Canceled',
}

export class PaymentDto {
  clientId: number;
  beneficiaryId: number;
  amount: number;
  paymentDate: Date;
  paymentStatus: PaymentStatus;

  constructor(
    clientId: number,
    beneficiaryId: number,
    amount: number,
    paymentDate: Date,
    paymentStatus: PaymentStatus = PaymentStatus.Pending
  ) {
    this.clientId = clientId;
    this.beneficiaryId = beneficiaryId;
    this.amount = amount;
    this.paymentDate = paymentDate;
    this.paymentStatus = paymentStatus;
  }
}
