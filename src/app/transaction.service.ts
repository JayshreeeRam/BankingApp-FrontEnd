import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// Define a Transaction interface (you can customize it)
export interface Transaction {
  id: number;
  sender: string;
  receiver: string;
  amount: number;
  status: string; // e.g. 'Pending', 'Completed'
}

@Injectable({
  providedIn: 'root'  // this makes the service singleton and available app-wide
})
export class TransactionService {
  // Initial dummy data of transactions
  private transactions: Transaction[] = [
    { id: 1, sender: 'User A', receiver: 'User B', amount: 1000, status: 'Pending' },
    { id: 2, sender: 'User C', receiver: 'User D', amount: 2000, status: 'Pending' }
  ];

  // Use BehaviorSubject to store current state and emit changes
  private transactionsSubject = new BehaviorSubject<Transaction[]>(this.transactions);

  // Observable for components to subscribe to
  transactions$ = this.transactionsSubject.asObservable();

  // Method to update status of a transaction
  updateStatus(id: number, newStatus: string) {
    // Update the transactions array immutably
    this.transactions = this.transactions.map(txn =>
      txn.id === id ? { ...txn, status: newStatus } : txn
    );

    // Emit the updated transactions list
    this.transactionsSubject.next(this.transactions);
  }
}
