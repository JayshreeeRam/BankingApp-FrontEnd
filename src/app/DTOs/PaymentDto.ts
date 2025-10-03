import { PaymentStatus } from "../Enum/PaymentStatus 1";

export class PaymentDto {
  paymentId: number;
  clientId: number;
  clientName: string;          // Added sender/client name
  beneficiaryId: number;
  beneficiaryName: string;     // Added beneficiary name
  amount: number;
  paymentDate: Date;
  paymentStatus: PaymentStatus;
   remark?: string;     // Add this for rejection remarks

  constructor(
    paymentId: number,
    clientId: number,
    clientName: string,
    beneficiaryId: number,
    beneficiaryName: string,
    amount: number,
    paymentDate: Date,
    paymentStatus: PaymentStatus = PaymentStatus.Pending,
     remark?: string,  // Add this parameter
  ) {
    this.paymentId = paymentId;
    this.clientId = clientId;
    this.clientName = clientName;
    this.beneficiaryId = beneficiaryId;
    this.beneficiaryName = beneficiaryName;
    this.amount = amount;
    this.paymentDate = paymentDate;
    this.paymentStatus = paymentStatus;
    this. remark= remark;  // Initialize here
  }
}