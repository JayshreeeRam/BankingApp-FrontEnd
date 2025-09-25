export class CreateEmployeeDto {
  name: string;
  bankId?: number;  // Optional field
  clientId?: number;  // Optional field

  constructor(name: string, bankId?: number, clientId?: number) {
    this.name = name;
    this.bankId = bankId;
    this.clientId = clientId;
  }
}
