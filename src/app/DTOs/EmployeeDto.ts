export class EmployeeDto {
  employeeId: number;
  employeeName: string;
  bankId: number;
  bankName?: string;
  senderClientId: number; // employer ID
  senderName?: string;
  employeeClientId: number;
  salary: number;
  Department?: string;

  constructor(
    employeeId: number,
    employeeName: string,
    bankId: number,
    bankName: string | undefined,
    senderClientId: number,
    senderName: string | undefined,
    employeeClientId: number,
    salary: number,
    Department?: string
  ) {
    this.employeeId = employeeId;
    this.employeeName = employeeName;
    this.bankId = bankId;
    this.bankName = bankName;
    this.senderClientId = senderClientId;
    this.senderName = senderName;
    this.employeeClientId = employeeClientId;
    this.salary = salary;
    this.Department = Department;
  }
}
