export class EmployeeDto {
  employeeId: number;
  employeeName: string;  // rename here
  bankId: number;
  bankName?: string;
  clientId: number;
  clientName?: string;
  salary: number;

  constructor(
    employeeId: number,
    employeeName: string,
    bankId: number,
    bankName: string | undefined,
    clientId: number,
    clientName: string | undefined,
    salary: number
  ) {
    this.employeeId = employeeId;
    this.employeeName = employeeName;
    this.bankId = bankId;
    this.bankName = bankName;
    this.clientId = clientId;
    this.clientName = clientName;
    this.salary = salary;
  }
}
