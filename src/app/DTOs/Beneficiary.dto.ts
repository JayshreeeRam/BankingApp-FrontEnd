export interface BeneficiaryDto {
  beneficiaryId: number;
  bankName: string;
  accountNo?: string | null;
  ifsccode : string;
  clientId: number;
}
