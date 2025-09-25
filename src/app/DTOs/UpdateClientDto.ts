import { AccountStatus } from '../Enum/AccountStatus 1';  // Assuming enums are defined in the enums file
import{AccountType} from '../Enum/AccountType 1'
export class UpdateClientDto {
  name?: string;  // Optional
  address?: string;  // Optional
  bankId?: number;  // Optional
  userId?: number;  // Optional
  verificationStatus: AccountStatus = AccountStatus.Pending;
  //accountType: AccountType;
  accountNo?: string;  // Optional

  constructor(
    name?: string,
    address?: string,
    bankId?: number,
    userId?: number,
    verificationStatus: AccountStatus = AccountStatus.Pending,
   // accountType:AccountType,
    accountNo?: string
  ) {
    this.name = name;
    this.address = address;
    this.bankId = bankId;
    this.userId = userId;
    this.verificationStatus = verificationStatus;
    //this.accountType = accountType;
    this.accountNo = accountNo;
  }
}
