export class Bank {
    bankId: number;
    name: string;
    address?: string; // Optional address field
    // clients?: Client[]; // Optional relationship with Client(s)

    constructor(bankId: number, name: string, address?: string,){ //clients?: Client[]) {
        this.bankId = bankId;
        this.name = name;
        this.address = address;
        // this.clients = clients;
    }
}
