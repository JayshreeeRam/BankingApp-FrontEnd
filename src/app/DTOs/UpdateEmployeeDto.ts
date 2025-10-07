export class UpdateEmployeeDto {
  name: string;
  bankId?: number;  
  clientId?: number; 
  Department?: string; 
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
