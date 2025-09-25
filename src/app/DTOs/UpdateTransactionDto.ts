export class UpdateTransactionDto {
  amount?: number;  // Optional property, can be null or not provided
  transactionType?: string;  // Optional property, can be null or not provided
  transactionStatus?: string;  // Optional property, can be null or not provided

  constructor(
    amount?: number,
    transactionType?: string,
    transactionStatus?: string
  ) {
    this.amount = amount;
    this.transactionType = transactionType;
    this.transactionStatus = transactionStatus;
  }
}
