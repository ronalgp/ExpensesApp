import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transaction } from '../models/transaction';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private baseUrl = environment.apiUrl + 'transactions';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.baseUrl}/all`);
  }
  getById(id: number): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.baseUrl}/details/${id}`);
  }
  create(transaction: Transaction): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.baseUrl}/create`, transaction);
  }
  update(id: number, transaction: Transaction): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/update/${id}`, transaction);
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
  }
}
