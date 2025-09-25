import { PaymentStatus } from '../Enum/PaymentStatus 1';  // Assuming PaymentStatus is defined in the enums file

export class SalaryDisbursementDto {
  disbursementId: number;
  employeeId: number;
  employeeName: string;
  senderName: string;  // Client/Company sending salary
  clientId: number;
  amount: number;  // Automatically fetched, not input by user
  date: Date;
  status: PaymentStatus;
  batchId: number;

  constructor(
    disbursementId: number,
    employeeId: number,
    employeeName: string,
    senderName: string,
    clientId: number,
    amount: number,
    date: Date,
    status: PaymentStatus,
    batchId: number
  ) {
    this.disbursementId = disbursementId;
    this.employeeId = employeeId;
    this.employeeName = employeeName;
    this.senderName = senderName;
    this.clientId = clientId;
    this.amount = amount;
    this.date = date;
    this.status = status;
    this.batchId = batchId;
  }
}
