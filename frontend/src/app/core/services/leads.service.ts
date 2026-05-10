import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

export interface RunningLoan {
  id?: string;
  sno: number | null;
  customer_name: string;
  lap: number | null;
  sme: number | null;
  hl: number | null;
  personal: number | null;
  edu_loan: number | null;
  bank_1: string | null;
  bank_2: string | null;
  bank_3: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface CompletedLoan {
  id?: string;
  sno: number | null;
  customer_name: string;
  phone: string | null;
  loan_type: string | null;
  loan_amount: number | null;
  interest_rate: number | null;
  emi: number | null;
  month_label: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ExcelUploadResponse {
  message: string;
  runningLoansImported: number;
  completedLoansImported: number;
  monthLabel?: string;
}

@Injectable({ providedIn: 'root' })
export class LeadsService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  getRunningLoans(): Observable<RunningLoan[]> {
    const token = this.authService.getToken();
    const headers = { 'Authorization': `Bearer ${token}` };
    return this.http.get<RunningLoan[]>(`${environment.apiUrl}/leads/running`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  getCompletedLoans(): Observable<CompletedLoan[]> {
    const token = this.authService.getToken();
    const headers = { 'Authorization': `Bearer ${token}` };
    return this.http.get<CompletedLoan[]>(`${environment.apiUrl}/leads/completed`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  addRunningLoan(loan: Omit<RunningLoan, 'id' | 'created_at' | 'updated_at'>): Observable<RunningLoan> {
    const token = this.authService.getToken();
    const headers = { 'Authorization': `Bearer ${token}` };
    return this.http.post<RunningLoan>(`${environment.apiUrl}/leads/running`, loan, { headers });
  }

  addCompletedLoan(loan: Omit<CompletedLoan, 'id' | 'created_at' | 'updated_at'>): Observable<CompletedLoan> {
    const token = this.authService.getToken();
    const headers = { 'Authorization': `Bearer ${token}` };
    return this.http.post<CompletedLoan>(`${environment.apiUrl}/leads/completed`, loan, { headers });
  }

  deleteRunningLoan(id: string): Observable<void> {
    const token = this.authService.getToken();
    const headers = { 'Authorization': `Bearer ${token}` };
    return this.http.delete<void>(`${environment.apiUrl}/leads/running/${id}`, { headers });
  }

  deleteCompletedLoan(id: string): Observable<void> {
    const token = this.authService.getToken();
    const headers = { 'Authorization': `Bearer ${token}` };
    return this.http.delete<void>(`${environment.apiUrl}/leads/completed/${id}`, { headers });
  }

  uploadExcel(file: File): Observable<ExcelUploadResponse> {
    const token = this.authService.getToken();
    const headers = { 'Authorization': `Bearer ${token}` };
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ExcelUploadResponse>(`${environment.apiUrl}/leads/upload`, formData, { headers });
  }

  private handleError(error: HttpErrorResponse) {
    console.error('LeadsService error:', error);
    return throwError(error);
  }
}
