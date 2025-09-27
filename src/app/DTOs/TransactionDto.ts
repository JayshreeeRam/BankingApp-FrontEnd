import { TransactionStatus } from '../Enum/TransactionStatus 1'; 
import{TransactionType} from '../Enum/TransactionType 1'  // Assuming enums are defined in the enums file

export class TransactionDto {
  transactionId: number;
  accountId: number;
  transactionType: TransactionType;
  amount: number;
  transactionStatus: TransactionStatus = TransactionStatus.Pending;
  transactionDate: Date = new Date();
  senderId: number;
  receiverId: number;
  senderName?: string;
  receiverName?: string;

  constructor(
      transactionId: number,
    accountId: number,
    transactionType: TransactionType,
    amount: number,
    senderId: number,
    receiverId: number,
    senderName?: string,
    receiverName?: string,
    transactionStatus: TransactionStatus = TransactionStatus.Pending,
    transactionDate: Date = new Date()
  ) {
      this.transactionId = transactionId;
    this.accountId = accountId;
    this.transactionType = transactionType;
    this.amount = amount;
    this.senderId = senderId;
    this.receiverId = receiverId;
    this.senderName = senderName;
    this.receiverName = receiverName;
    this.transactionStatus = transactionStatus;
    this.transactionDate = transactionDate;
  }
}
