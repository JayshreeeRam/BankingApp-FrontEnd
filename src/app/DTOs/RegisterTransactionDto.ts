export class RegisterTransactionDto {
  accountId: number;
  transactionType: string;
  amount: number;
  transactionStatus: string;

  constructor(
    accountId: number,
    transactionType: string,
    amount: number,
    transactionStatus: string = 'Pending'
  ) {
    this.accountId = accountId;
    this.transactionType = transactionType;
    this.amount = amount;
    this.transactionStatus = transactionStatus;
  }
}
