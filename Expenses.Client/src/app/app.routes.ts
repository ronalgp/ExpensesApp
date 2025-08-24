import { Routes } from '@angular/router';
import { Login } from '../components/login/login';
import { Signup } from '../components/signup/signup';
import { TransactionList } from '../components/transaction-list/transaction-list';
import { TransactionForm } from '../components/transaction-form/transaction-form';

export const routes: Routes = [
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'signup',
    component: Signup,
  },
  {
    path: 'transactions',
    component: TransactionList,
  },
  {
    path: 'add',
    component: TransactionForm,
  },
  {
    path: 'edit/:id',
    component: TransactionForm,
  },
  {
    path: '**',
    redirectTo: '/transactions'
  },
  {
    path: '',
    redirectTo: '/transactions',
    pathMatch: 'full'
  }
];
