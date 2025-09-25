export class EmployeeDto {
  employeeId: number;
  name: string;
  bankId: number;
  bankName?: string; // Optional property
  clientId: number;
  clientName?: string; // Optional property
  salary: number;

  constructor(
    employeeId: number,
    name: string,
    bankId: number,
    bankName: string | undefined,
    clientId: number,
    clientName: string | undefined,
    salary: number
  ) {
    this.employeeId = employeeId;
    this.name = name;
    this.bankId = bankId;
    this.bankName = bankName;
    this.clientId = clientId;
    this.clientName = clientName;
    this.salary = salary;
  }
}
