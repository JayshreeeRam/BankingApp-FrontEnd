export class Beneficiary {
    beneficiaryId: number;
    bankName: string;
    accountNo?: string; // Optional property
    // ifscCode: string;
    // clientId: number;
    // client?: Client; // Optional relationship with Client

    constructor(
        beneficiaryId: number,
        bankName: string,
        accountNo?: string,
        //ifscCode: string,
        //clientId: number,
        // client?: Client
    ) {
        this.beneficiaryId = beneficiaryId;
        this.bankName = bankName;
        this.accountNo = accountNo;
        // this.ifscCode = ifscCode;
        // this.clientId = clientId;
        // this.client = client;
    }
}
