export interface BeneficiaryDto {
  beneficiaryId: number;
  bankName: string;
  accountNo?: string | null;
  ifscCode: string;
  clientId: number;
}
