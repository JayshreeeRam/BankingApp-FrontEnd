export class Beneficiary {
  beneficiaryId: number;
  bankName: string;
  accountNo?: string; // Optional
  ifscCode: string;

  constructor(
    beneficiaryId: number,
    bankName: string,
    ifscCode: string,
    accountNo?: string, // optional can be last for clarity
  ) {
    this.beneficiaryId = beneficiaryId;
    this.bankName = bankName;
    this.accountNo = accountNo;
    this.ifscCode = ifscCode;
  }
}
