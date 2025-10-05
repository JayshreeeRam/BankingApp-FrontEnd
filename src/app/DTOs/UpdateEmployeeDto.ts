export class UpdateEmployeeDto {
  name: string;
  bankId?: number;  // Optional, can be null or not provided
  clientId?: number;  // Optional, can be null or not provided
  Department?: string; // Optional field
  constructor(
    name: string,
    bankId?: number,
    clientId?: number,
    Department?: string
  ) {
    this.name = name;
    this.bankId = bankId;
    this.clientId = clientId;
    this.Department = Department;
  }
}
