import { AccountType  } from '../Enum/AccountType 1';  // Assuming enums are defined in the enums file
import{AccountStatus} from '../Enum/AccountStatus 1'
export class UpdateAccountDto {
  accountNumber: string;
  accountType?: AccountType;  // Optional, can be null or undefined
  accountStatus?: AccountStatus;  // Optional, can be null or undefined
  balance?: number;  // Optional, can be null or undefined

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
