export class UpdateTransactionDto {
  amount?: number;  
  transactionType?: string;  
  transactionStatus?: string;  

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
