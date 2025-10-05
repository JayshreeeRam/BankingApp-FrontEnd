import { PaymentStatus } from '../Enum/PaymentStatus 1';

export class SalaryDisbursementDto {
  disbursementId: number;
  employeeId: number;
  employeeName: string;
  senderName: string;    // Employer client/company
  clientId: number;
  amount: number;
  date: Date;
  status: PaymentStatus;
  batchId: string;       // Now department instead of numeric batch

  constructor(
    disbursementId: number,
    employeeId: number,
    employeeName: string,
    senderName: string,
    clientId: number,
    amount: number,
    date: Date,
    status: PaymentStatus,
    batchId: string
  ) {
    this.disbursementId = disbursementId;
    this.employeeId = employeeId;
    this.employeeName = employeeName;
    this.senderName = senderName;
    this.clientId = clientId;
    this.amount = amount;
    this.date = date;
    this.status = status;
    this.batchId = batchId;  // stores department name now
  }
}
