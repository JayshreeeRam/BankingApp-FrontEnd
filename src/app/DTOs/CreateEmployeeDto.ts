export class CreateEmployeeDto {
  name: string;
  bankId?: number;  // Optional field
  clientId?: number;  // Optional field
  Department?: string; // Optional field

  constructor(name: string, bankId?: number, clientId?: number, Department?: string ) {
    this.name = name;
    this.bankId = bankId;
    this.clientId = clientId;
    this.Department = Department;
  }
}
