import { AccountType } from '../Enum/AccountType 1';
import { AccountStatus } from '../Enum/AccountStatus 1'; 
// import { Client } from '../Enum/';
// import { Transaction } from '../Enum/';  

export class Account {
    accountId: number;
    accountNumber: string;
    accountType: AccountType;
    accountStatus: AccountStatus;
    balance: number;
    clientId: number;
    // client: Client; // This represents a related Client object
    // transactions?: Transaction[]; // Optional relationship with transactions

    constructor(
        accountId: number,
        accountNumber: string,
        accountType: AccountType,
        accountStatus: AccountStatus,
        balance: number,
        clientId: number,
        // client: Client,
        // transactions?: Transaction[]
    ) {
        this.accountId = accountId;
        this.accountNumber = accountNumber;
        this.accountType = accountType;
        this.accountStatus = accountStatus;
        this.balance = balance;
        this.clientId = clientId;
        // this.client = client;
        // this.transactions = transactions;
    }
}
