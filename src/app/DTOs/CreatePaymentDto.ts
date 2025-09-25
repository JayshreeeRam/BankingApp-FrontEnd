export class CreatePaymentDto {
  clientId: number;
  beneficiaryId: number;
  amount: number;
  paymentDate: Date;

  constructor(clientId: number, beneficiaryId: number, amount: number, paymentDate: Date) {
    this.clientId = clientId;
    this.beneficiaryId = beneficiaryId;
    this.amount = amount;
    this.paymentDate = paymentDate;
  }
}
