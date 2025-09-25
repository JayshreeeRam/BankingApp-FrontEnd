import { Client } from './Client';  // Assuming Client model is in client.model.ts
import { Beneficiary } from './Beneficiary';  // Assuming Beneficiary model is in beneficiary.model.ts
import { PaymentStatus } from '../Enum/PaymentStatus 1'; // Assuming PaymentStatus enum is in payment-status.enum.ts

export class Payment {
    paymentId: number;
    clientId: number;
    client: Client;  // FK relationship with Client
    beneficiaryId: number;
    beneficiary: Beneficiary;  // FK relationship with Beneficiary
    amount: number;
    paymentDate: Date;
    paymentStatus: PaymentStatus;  // Enum for PaymentStatus

    constructor(
        paymentId: number,
        clientId: number,
        client: Client,
        beneficiaryId: number,
        beneficiary: Beneficiary,
        amount: number,
        paymentDate: Date,
        paymentStatus: PaymentStatus
    ) {
        this.paymentId = paymentId;
        this.clientId = clientId;
        this.client = client;
        this.beneficiaryId = beneficiaryId;
        this.beneficiary = beneficiary;
        this.amount = amount;
        this.paymentDate = paymentDate;
        this.paymentStatus = paymentStatus;
    }
}
