import { AccountStatus } from "../Enum/AccountStatus 1";
import { AccountType } from "../Enum/AccountType 1";

export interface AccountDto {
  accountId: number;
  accountNumber: string;
  accountType?: AccountType | null;
  accountStatus?: AccountStatus | null;
  balance: number;  // decimal in C# maps to number in TS
  clientId: number;
}
