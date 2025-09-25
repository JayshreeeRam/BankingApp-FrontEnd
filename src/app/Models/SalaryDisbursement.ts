import { Employee } from './Employee';  // Assuming Employee model is in employee.model.ts
import { Client } from './Client'; // Assuming Client model is in client.model.ts
import { PaymentStatus } from '../Enum/PaymentStatus 1';  // Assuming PaymentStatus enum is in payment-status.enum.ts

export class SalaryDisbursement {
    disbursementId: number;
    employeeId: number;
    employee?: Employee;  // Nullable reference to Employee
    clientId: number;
    client?: Client;  // Nullable reference to Client
    amount: number;
    status: PaymentStatus;
    date: Date;
    batchId: number;

    constructor(
        disbursementId: number,
        employeeId: number,
        employee: Employee | undefined,
        clientId: number,
        client: Client | undefined,
        amount: number,
        status: PaymentStatus,
        date: Date,
        batchId: number
    ) {
        this.disbursementId = disbursementId;
        this.employeeId = employeeId;
        this.employee = employee;
        this.clientId = clientId;
        this.client = client;
        this.amount = amount;
        this.status = status;
        this.date = date;
        this.batchId = batchId;
    }
}
