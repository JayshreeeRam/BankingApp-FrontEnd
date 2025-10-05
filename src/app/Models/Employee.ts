export class Employee {
  id: number;           // Table index
  employeeId: number;
  name: string;
  bankId: number;
  bankName: string;
  salary: number;
  clientId: number;
  clientName: string;
  Department?: string;

  constructor(
    id: number,
    employeeId: number,
    name: string,
    bankId: number,
    bankName: string,
    salary: number,
    clientId: number,
    clientName: string,
    Department?: string
  ) {
    this.id = id;
    this.employeeId = employeeId;
    this.name = name;
    this.bankId = bankId;
    this.bankName = bankName;
    this.salary = salary;
    this.clientId = clientId;
    this.clientName = clientName;
    this.Department = Department;
  }
}
