import { Bank } from '../Models/Bank';  // Assuming Bank model is in bank.model.ts
import { Client } from '../Models/Client';  // Assuming Client model is in client.model.ts
import { SalaryDisbursement } from './SalaryDisbursement';

export class Employee {
    employeeId: number;
    name: string;
    bankId: number;
    bank: Bank | null;  // FK relationship with Bank
    salary: number;
    clientId: number;
    client: Client | null;  // FK relationship with Client
    salaryDisbursements: SalaryDisbursement[] | null;  // One-to-many relationship with SalaryDisbursement

    constructor(
        employeeId: number,
        name: string,
        bankId: number,
        bank: Bank | null,
        salary: number,
        clientId: number,
        client: Client | null,
        salaryDisbursements: SalaryDisbursement[] | null
    ) {
        this.employeeId = employeeId;
        this.name = name;
        this.bankId = bankId;
        this.bank = bank;
        this.salary = salary;
        this.clientId = clientId;
        this.client = client;
        this.salaryDisbursements = salaryDisbursements;
    }
}
