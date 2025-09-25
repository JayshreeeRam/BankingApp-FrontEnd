import { AccountStatus } from "../Enum/AccountStatus 1";
import { AccountType } from "../Enum/AccountType 1";


export interface ClientDto {
  clientId: number;
  name: string;
  address?: string | null;

  bankId: number;
  userId: number;

  accountNo: string;

  verificationStatus?: AccountStatus | null; // default: AccountStatus.Pending (handle default in logic)
  accountType?: AccountType | null;
}
