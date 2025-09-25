export class UpdateEmployeeDto {
  name: string;
  bankId?: number;  // Optional, can be null or not provided
  clientId?: number;  // Optional, can be null or not provided

  constructor(
    name: string,
    bankId?: number,
    clientId?: number
  ) {
    this.name = name;
    this.bankId = bankId;
    this.clientId = clientId;
  }
}
