import { Account } from './Account';  // Assuming Account model is in account.model.ts
import { Client } from './Client';  // Assuming Client model is in client.model.ts
import { TransactionType } from '../Enum/TransactionType 1';  // Assuming TransactionType enum is in transaction-type.enum.ts
import { TransactionStatus } from '../Enum/TransactionStatus 1';  // Assuming TransactionStatus enum is in transaction-status.enum.ts

export class Transaction {
    transactionId: number;
    accountId: number;
    account?: Account;  // Nullable reference to Account
    transactionType: TransactionType;
    amount: number;
    senderId: number;
    sender?: Client;  // Nullable reference to Sender (Client)
    receiverId: number;
    receiver?: Client;  // Nullable reference to Receiver (Client)
    senderName: string;
    receiverName: string;
    transactionStatus: TransactionStatus;
    transactionDate: Date;

    constructor(
        transactionId: number,
        accountId: number,
        account: Account | undefined,
        transactionType: TransactionType,
        amount: number,
        senderId: number,
        sender: Client | undefined,
        receiverId: number,
        receiver: Client | undefined,
        senderName: string,
        receiverName: string,
        transactionStatus: TransactionStatus,
        transactionDate: Date
    ) {
        this.transactionId = transactionId;
        this.accountId = accountId;
        this.account = account;
        this.transactionType = transactionType;
        this.amount = amount;
        this.senderId = senderId;
        this.sender = sender;
        this.receiverId = receiverId;
        this.receiver = receiver;
        this.senderName = senderName;
        this.receiverName = receiverName;
        this.transactionStatus = transactionStatus;
        this.transactionDate = transactionDate;
    }
}
