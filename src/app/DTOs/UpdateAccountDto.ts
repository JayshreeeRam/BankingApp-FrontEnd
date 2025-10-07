import { AccountType  } from '../Enum/AccountType 1';  
import{AccountStatus} from '../Enum/AccountStatus 1'
export class UpdateAccountDto {
  accountNumber: string;
  accountType?: AccountType;  
  accountStatus?: AccountStatus; 
  balance?: number;  

  constructor(
    accountNumber: string,
    accountType?: AccountType,
    accountStatus?: AccountStatus,
    balance?: number
  ) {
    this.accountNumber = accountNumber;
    this.accountType = accountType;
    this.accountStatus = accountStatus;
    this.balance = balance;
  }
}
