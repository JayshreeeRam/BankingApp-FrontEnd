export class Bank {
    bankId: number;
    name: string;
    address?: string;
    ifsccode : string;
    // clients?: Client[]; // Add when Client class is defined

    constructor(bankId: number, name: string, ifsccode : string, address?: string) {
        this.bankId = bankId;
        this.name = name;
        this.ifsccode  = ifsccode ;
        this.address = address;
        // this.clients = clients;
    }
}
