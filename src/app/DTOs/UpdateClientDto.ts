import { AccountStatus } from '../Enum/AccountStatus 1';  
import{AccountType} from '../Enum/AccountType 1'
export class UpdateClientDto {
  name?: string;  
  address?: string;  
  bankId?: number;  
  userId?: number;  
  verificationStatus: AccountStatus = AccountStatus.Pending;
  
  accountNo?: string;  

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
