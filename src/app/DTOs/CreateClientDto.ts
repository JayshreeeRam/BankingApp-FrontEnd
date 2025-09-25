import { AccountType } from '../Enum/AccountType 1'; // Import your AccountType enum here

export class CreateClientDto {
  name: string;
  address?: string;
  bankId: number;
  userId: number;
  accountType: AccountType | null;
  accountNo?: string;

  constructor(name: string, bankId: number, userId: number, accountType: AccountType | null, address?: string, accountNo?: string) {
    this.name = name;
    this.bankId = bankId;
    this.userId = userId;
    this.accountType = accountType;
    this.address = address;
    this.accountNo = accountNo;
  }
}
