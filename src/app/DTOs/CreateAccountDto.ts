import { AccountType } from '../Enum/AccountType 1'; 
import { AccountStatus } from '../Enum/AccountStatus 1'; 

export class CreateAccountDto {
  accountNumber: string;
  accountType: AccountType | null;
  accountStatus: AccountStatus | null;
  balance: number;
  clientId: number;

  constructor(accountNumber: string, accountType: AccountType | null, accountStatus: AccountStatus | null, balance: number, clientId: number) {
    this.accountNumber = accountNumber;
    this.accountType = accountType;
    this.accountStatus = accountStatus;
    this.balance = balance;
    this.clientId = clientId;
  }
}
