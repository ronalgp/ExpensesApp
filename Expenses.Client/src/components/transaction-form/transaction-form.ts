import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionService } from '../../services/transaction';

@Component({
  selector: 'app-transaction-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './transaction-form.html',
  styleUrl: './transaction-form.css',
})
export class TransactionForm implements OnInit {
  transactionForm: FormGroup;
  incomeCategories = ['Salary', 'Business', 'Investment', 'Gift', 'Other'];
  expenseCategories = [
    'Food',
    'Rent',
    'Utilities',
    'Entertainment',
    'Travel',
    'Other',
  ];
  availableCategories: string[] = [];

  editMode = false;
  transactionId?: number;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private transactionService: TransactionService,
    private activitedRoute: ActivatedRoute
  ) {
    this.transactionForm = this.fb.group({
      type: ['Expense', Validators.required],
      amount: ['', [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const type = this.transactionForm.get('type')?.value;
    this.updateAvailableCategories(type);

    const id = this.activitedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.editMode = true;
      this.transactionId = +id;
      this.loadTransaction(this.transactionId);
    }
  }

  loadTransaction(transactionId: number): void {
    this.transactionService.getById(transactionId).subscribe({
      next: (transaction) => {
        this.updateAvailableCategories(transaction.type);

        this.transactionForm.patchValue({
          type: transaction.type,
          amount: transaction.amount,
          category: transaction.category,
        });
      },
      error: (err) => {
        console.error('Error loading transaction', err);
      },
    });
  }

  onSubmit() {
    if (this.transactionForm.valid) {
      const transaction = this.transactionForm.value;

      if (this.editMode && this.transactionId) {
        transaction.id = this.transactionId;
        console.log('Transaction updated:', transaction);
        this.transactionService.update(transaction.id, transaction).subscribe({
          next: () => {
            this.router.navigate(['/transactions']);
          },
          error: (err) => {
            console.error('Error updating transaction', err);
          },
        });
      } else {
        this.transactionService.create(transaction).subscribe({
          next: () => {
            this.router.navigate(['/transactions']);
          },
          error: (err) => {
            console.error('Error adding transaction', err);
          },
        });
      }
    }
  }

  cancel() {
    this.router.navigate(['/transactions']);
  }

  onTypeChange() {
    const type = this.transactionForm.get('type')?.value;
    this.updateAvailableCategories(type);
  }

  updateAvailableCategories(type: string) {
    this.availableCategories =
      type === 'Income' ? this.incomeCategories : this.expenseCategories;
    this.transactionForm.patchValue({ category: '' });
  }
}
