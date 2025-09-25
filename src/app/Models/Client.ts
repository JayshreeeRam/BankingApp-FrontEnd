import { Bank } from '../Models/Bank'; 
import { User } from './User'; 
import { Beneficiary } from '../Models/Beneficiary';  
import { Employee } from '../Models/Employee';  
import { Payment } from '../Models/Payment'; 
import { SalaryDisbursement } from '../Models/SalaryDisbursement';  
import { AccountStatus } from '../Enum/AccountStatus 1';  
import { AccountType } from '../Enum/AccountType 1';  

export class Client {
    clientId: number;
    name: string;
    address?: string;  // Optional
    bankId: number;
    bank: Bank;  // Relationship with Bank model
    userId: number;
    user: User;  // Relationship with User model
    accountNo: string;
    verificationStatus: AccountStatus;
    accountType: AccountType;

    // Optional collections for related models
    beneficiaries?: Beneficiary[];
    employees?: Employee[];
    payments?: Payment[];
    salaryDisbursements?: SalaryDisbursement[];

constructor(
    clientId: number,
    name: string,
    bankId: number,
    bank: Bank,
    userId: number,
    user: User,
    accountNo: string,
    verificationStatus: AccountStatus,
    accountType: AccountType,
    address?: string,  // move optional ones to the end
    beneficiaries?: Beneficiary[],
    employees?: Employee[],
    payments?: Payment[],
    salaryDisbursements?: SalaryDisbursement[]
) {
    this.clientId = clientId;
    this.name = name;
    this.address = address;
    this.bankId = bankId;
    this.bank = bank;
    this.userId = userId;
    this.user = user;
    this.accountNo = accountNo;
    this.verificationStatus = verificationStatus;
    this.accountType = accountType;
    this.beneficiaries = beneficiaries;
    this.employees = employees;
    this.payments = payments;
    this.salaryDisbursements = salaryDisbursements;
}
}
