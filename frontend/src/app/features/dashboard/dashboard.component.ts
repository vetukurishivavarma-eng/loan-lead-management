import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../core/services/auth.service';
import { LeadsService, RunningLoan, CompletedLoan } from '../../core/services/leads.service';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatTabsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  template: `
    <div class="dashboard-container">
      <mat-toolbar color="primary">
        <span>Loan Lead Management</span>
        <span class="spacer"></span>
        <button mat-button (click)="logout()">Logout</button>
      </mat-toolbar>

      <div class="content">
        <mat-tab-group animationDuration="300ms">
          <mat-tab label="Running Loans">
            <div class="tab-content">
              @if (loading) {
                <div class="spinner-container">
                  <mat-spinner diameter="50"></mat-spinner>
                </div>
              } @else {
                <table mat-table [dataSource]="runningLoans" matSort class="mat-elevation-z8">
                  <ng-container matColumnDef="sno">
                    <th mat-header-cell *matHeaderCellDef mat-sort-header>SNO</th>
                    <td mat-cell *matCellDef="let element">{{element.sno}}</td>
                  </ng-container>
                  <ng-container matColumnDef="customer_name">
                    <th mat-header-cell *matHeaderCellDef mat-sort-header>Customer Name</th>
                    <td mat-cell *matCellDef="let element">{{element.customer_name}}</td>
                  </ng-container>
                  <ng-container matColumnDef="lap">
                    <th mat-header-cell *matHeaderCellDef mat-sort-header>LAP</th>
                    <td mat-cell *matCellDef="let element">{{element.lap | number}}</td>
                  </ng-container>
                  <ng-container matColumnDef="sme">
                    <th mat-header-cell *matHeaderCellDef mat-sort-header>SME</th>
                    <td mat-cell *matCellDef="let element">{{element.sme | number}}</td>
                  </ng-container>
                  <ng-container matColumnDef="hl">
                    <th mat-header-cell *matHeaderCellDef mat-sort-header>HL</th>
                    <td mat-cell *matCellDef="let element">{{element.hl | number}}</td>
                  </ng-container>
                  <ng-container matColumnDef="personal">
                    <th mat-header-cell *matHeaderCellDef mat-sort-header>Personal</th>
                    <td mat-cell *matCellDef="let element">{{element.personal | number}}</td>
                  </ng-container>
                  <ng-container matColumnDef="edu_loan">
                    <th mat-header-cell *matHeaderCellDef mat-sort-header>Edu Loan</th>
                    <td mat-cell *matCellDef="let element">{{element.edu_loan | number}}</td>
                  </ng-container>
                  <ng-container matColumnDef="bank_1">
                    <th mat-header-cell *matHeaderCellDef>Bank 1</th>
                    <td mat-cell *matCellDef="let element">{{element.bank_1}}</td>
                  </ng-container>
                  <ng-container matColumnDef="bank_2">
                    <th mat-header-cell *matHeaderCellDef>Bank 2</th>
                    <td mat-cell *matCellDef="let element">{{element.bank_2}}</td>
                  </ng-container>
                  <ng-container matColumnDef="bank_3">
                    <th mat-header-cell *matHeaderCellDef>Bank 3</th>
                    <td mat-cell *matCellDef="let element">{{element.bank_3}}</td>
                  </ng-container>
                  <ng-container matColumnDef="actions">
                    <th mat-header-cell *matHeaderCellDef>Actions</th>
                    <td mat-cell *matCellDef="let element">
                      <button mat-icon-button color="warn" matTooltip="Delete" (click)="deleteRunningLoan(element)">
                        <mat-icon>delete</mat-icon>
                      </button>
                    </td>
                  </ng-container>
                  <tr mat-header-row *matHeaderRowDef="runningColumns"></tr>
                  <tr mat-row *matRowDef="let row; columns: runningColumns;"></tr>
                </table>
                <mat-paginator [pageSizeOptions]="[10, 25, 50]" showFirstLastButtons></mat-paginator>
              }
            </div>
          </mat-tab>
          <mat-tab label="Completed Loans">
            <div class="tab-content">
              @if (loading) {
                <div class="spinner-container">
                  <mat-spinner diameter="50"></mat-spinner>
                </div>
              } @else {
                <table mat-table [dataSource]="completedLoans" matSort class="mat-elevation-z8">
                  <ng-container matColumnDef="sno">
                    <th mat-header-cell *matHeaderCellDef mat-sort-header>SNO</th>
                    <td mat-cell *matCellDef="let element">{{element.sno}}</td>
                  </ng-container>
                  <ng-container matColumnDef="customer_name">
                    <th mat-header-cell *matHeaderCellDef mat-sort-header>Customer Name</th>
                    <td mat-cell *matCellDef="let element">{{element.customer_name}}</td>
                  </ng-container>
                  <ng-container matColumnDef="phone">
                    <th mat-header-cell *matHeaderCellDef>Phone</th>
                    <td mat-cell *matCellDef="let element">{{element.phone}}</td>
                  </ng-container>
                  <ng-container matColumnDef="loan_type">
                    <th mat-header-cell *matHeaderCellDef mat-sort-header>Loan Type</th>
                    <td mat-cell *matCellDef="let element">{{element.loan_type}}</td>
                  </ng-container>
                  <ng-container matColumnDef="loan_amount">
                    <th mat-header-cell *matHeaderCellDef mat-sort-header>Amount</th>
                    <td mat-cell *matCellDef="let element">{{element.loan_amount | number}}</td>
                  </ng-container>
                  <ng-container matColumnDef="interest_rate">
                    <th mat-header-cell *matHeaderCellDef mat-sort-header>Interest Rate</th>
                    <td mat-cell *matCellDef="let element">{{element.interest_rate}}%</td>
                  </ng-container>
                  <ng-container matColumnDef="emi">
                    <th mat-header-cell *matHeaderCellDef mat-sort-header>EMI</th>
                    <td mat-cell *matCellDef="let element">{{element.emi | number}}</td>
                  </ng-container>
                  <ng-container matColumnDef="month_label">
                    <th mat-header-cell *matHeaderCellDef mat-sort-header>Month</th>
                    <td mat-cell *matCellDef="let element">{{element.month_label}}</td>
                  </ng-container>
                  <ng-container matColumnDef="actions">
                    <th mat-header-cell *matHeaderCellDef>Actions</th>
                    <td mat-cell *matCellDef="let element">
                      <button mat-icon-button color="warn" matTooltip="Delete" (click)="deleteCompletedLoan(element)">
                        <mat-icon>delete</mat-icon>
                      </button>
                    </td>
                  </ng-container>
                  <tr mat-header-row *matHeaderRowDef="completedColumns"></tr>
                  <tr mat-row *matRowDef="let row; columns: completedColumns;"></tr>
                </table>
                <mat-paginator [pageSizeOptions]="[10, 25, 50]" showFirstLastButtons></mat-paginator>
              }
            </div>
          </mat-tab>
        </mat-tab-group>
      </div>

      <button mat-fab color="primary" class="fab-add" matTooltip="Add Lead" (click)="addLead()">
        <mat-icon>add</mat-icon>
      </button>
      <button mat-fab color="accent" class="fab-upload" matTooltip="Upload Excel" (click)="uploadExcel()">
        <mat-icon>upload</mat-icon>
      </button>
    </div>
  `,
  styles: [`
    .dashboard-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
    }
    .content {
      flex: 1;
      overflow: auto;
    }
    .tab-content {
      padding: 16px;
    }
    table {
      width: 100%;
    }
    .spinner-container {
      display: flex;
      justify-content: center;
      padding: 48px;
    }
    .fab-add {
      position: fixed;
      bottom: 24px;
      right: 88px;
    }
    .fab-upload {
      position: fixed;
      bottom: 24px;
      right: 24px;
    }
    .spacer {
      flex: 1 1 auto;
    }
  `]
})
export class DashboardComponent implements OnInit {
  runningLoans: RunningLoan[] = [];
  completedLoans: CompletedLoan[] = [];
  loading = true;

  runningColumns = ['sno', 'customer_name', 'lap', 'sme', 'hl', 'personal', 'edu_loan', 'bank_1', 'bank_2', 'bank_3', 'actions'];
  completedColumns = ['sno', 'customer_name', 'phone', 'loan_type', 'loan_amount', 'interest_rate', 'emi', 'month_label', 'actions'];

  constructor(
    private authService: AuthService,
    private leadsService: LeadsService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    Promise.all([
      this.leadsService.getRunningLoans().toPromise(),
      this.leadsService.getCompletedLoans().toPromise()
    ]).then(([running, completed]) => {
      this.runningLoans = running || [];
      this.completedLoans = completed || [];
      this.loading = false;
    }).catch(() => {
      this.loading = false;
      this.snackBar.open('Failed to load data', 'Close', { duration: 3000 });
    });
  }

  logout(): void {
    this.authService.logout();
  }

  addLead(): void {
    this.router.navigate(['/leads/add']);
  }

  uploadExcel(): void {
    this.router.navigate(['/leads/upload']);
  }

  deleteRunningLoan(loan: RunningLoan): void {
    if (loan.id) {
      this.leadsService.deleteRunningLoan(loan.id).subscribe({
        next: () => {
          this.snackBar.open('Loan deleted successfully', 'Close', { duration: 3000 });
          this.loadData();
        },
        error: () => {
          this.snackBar.open('Failed to delete loan', 'Close', { duration: 3000 });
        }
      });
    }
  }

  deleteCompletedLoan(loan: CompletedLoan): void {
    if (loan.id) {
      this.leadsService.deleteCompletedLoan(loan.id).subscribe({
        next: () => {
          this.snackBar.open('Loan deleted successfully', 'Close', { duration: 3000 });
          this.loadData();
        },
        error: () => {
          this.snackBar.open('Failed to delete loan', 'Close', { duration: 3000 });
        }
      });
    }
  }
}
