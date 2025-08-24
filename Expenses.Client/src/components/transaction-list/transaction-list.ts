import { Component, inject, OnInit } from '@angular/core';
import { Transaction } from '../../models/transaction';
import { TransactionService } from '../../services/transaction';
import { AsyncPipe, CommonModule } from '@angular/common';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transaction-list',
  imports: [CommonModule, AsyncPipe],
  templateUrl: './transaction-list.html',
  styleUrl: './transaction-list.css',
})
export class TransactionList implements OnInit {
  private transactionsSubject = new BehaviorSubject<Transaction[]>([]);
  public transactions$: Observable<Transaction[]> =
    this.transactionsSubject.asObservable();

  protected totalIncome: number = 0;
  protected totalExpense: number = 0;

  constructor(
    private transactionService: TransactionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.transactionService
      .getAll()
      .subscribe((transactions: Transaction[]) => {
        this.transactionsSubject.next(transactions);
        this.getTotalIncome();
        this.getTotalExpense();
      });
  }

  getTotalIncome(): void {
    if (this.transactions$) {
      this.transactions$.subscribe((transactions) => {
        this.totalIncome = transactions
          .filter((t) => t.type === 'Income')
          .reduce((sum, t) => sum + t.amount, 0);
      });
    }
  }

  getTotalExpense(): void {
    if (this.transactions$) {
      this.transactions$.subscribe((transactions) => {
        this.totalExpense = transactions
          .filter((t) => t.type === 'Expense')
          .reduce((sum, t) => sum + t.amount, 0);
      });
    }
  }

  getNetBalance(): number {
    return this.totalIncome - this.totalExpense;
  }

  editTransaction(transaction: Transaction) {
    if (transaction && transaction.id) {
      this.router.navigate(['/edit/', transaction.id]);
    }
  }

  deleteTransaction(transaction: Transaction) {
    if (transaction && transaction.id) {
      if (confirm('Are you sure you want to delete this transaction?')) {
        this.transactionService.delete(transaction.id).subscribe({
          next: () => {
            console.log('Transaction deleted successfully');
            this.loadTransactions();
          },
          error: (err) => {
            console.error('Error deleting transaction:', err);
            alert('Failed to delete the transaction. Please try again.');
          },
        });
      }
    }
  }
}
