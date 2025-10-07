import { PaymentStatus } from "../Enum/PaymentStatus 1";

export class PaymentDto {
  paymentId: number;
  clientId: number;
  clientName: string;          
  beneficiaryId: number;
  beneficiaryName: string;    
  amount: number;
  paymentDate: Date;
  paymentStatus: PaymentStatus;
  remark?: string;     
  isLoading: boolean; 

  constructor(
    paymentId: number,
    clientId: number,
    clientName: string,
    beneficiaryId: number,
    beneficiaryName: string,
    amount: number,
    paymentDate: Date,
    paymentStatus: PaymentStatus = PaymentStatus.Pending,
    remark?: string,
    isLoading: boolean = false 
  ) {
    this.paymentId = paymentId;
    this.clientId = clientId;
    this.clientName = clientName;
    this.beneficiaryId = beneficiaryId;
    this.beneficiaryName = beneficiaryName;
    this.amount = amount;
    this.paymentDate = paymentDate;
    this.paymentStatus = paymentStatus;
    this.remark = remark;
    this.isLoading = isLoading;
  }
}