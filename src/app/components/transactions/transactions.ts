import { Component, OnInit } from '@angular/core';
import { TransactionDto } from '../../DTOs/TransactionDto';
import { TransactionService } from '../../services/transaction.service';
import { CommonModule, CurrencyPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-transactions',
 standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe, NgFor, NgIf],
  templateUrl: './transactions.html',
  styleUrls: ['./transactions.css'] 
})

export class Transactions implements OnInit {
  currentUserId: number | null = null;
  transactions: TransactionDto[] = [];

  constructor(
    private txService: TransactionService,
    private userService: UserService,
    private authService: AuthService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    // Get current user id from the token
     const userId = Number(this.route.snapshot.paramMap.get('id'));

    if (userId) {
      this.currentUserId = userId;

      // Now load transactions for this user id (assuming transactions are fetched by receiverId)
     this.loadTransactions(userId);
    } else {
      console.error('User ID not found in token');
    }
  }

  loadTransactions(userId: number) {
    this.txService.getTransactionsByUserId(userId).subscribe({
      next: (transactions) => {
        this.transactions = transactions;
      },
      error: (err) => {
        console.error('Failed to load transactions', err);
      }
    });
  }
}