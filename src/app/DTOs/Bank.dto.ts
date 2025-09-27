export interface BankDto {
  bankId: number;
  name: string;
  address?: string | null;
  ifscCode: string;
}
