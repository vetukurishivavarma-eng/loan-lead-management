import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LeadsService } from '../../../../core/services/leads.service';

@Component({
  selector: 'app-add-lead',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="add-lead-container">
      <mat-tab-group>
        <mat-tab label="Running Loan">
          <div class="tab-content">
            <form [formGroup]="runningForm" (ngSubmit)="submitRunning()">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>SNO</mat-label>
                <input matInput type="number" formControlName="sno">
              </mat-form-field>
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Customer Name</mat-label>
                <input matInput formControlName="customer_name">
                @if (runningForm.get('customer_name')?.hasError('required')) {
                  <mat-error>Customer name is required</mat-error>
                }
              </mat-form-field>
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>LAP</mat-label>
                <input matInput type="number" formControlName="lap">
              </mat-form-field>
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>SME</mat-label>
                <input matInput type="number" formControlName="sme">
              </mat-form-field>
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>HL</mat-label>
                <input matInput type="number" formControlName="hl">
              </mat-form-field>
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Personal Loan</mat-label>
                <input matInput type="number" formControlName="personal">
              </mat-form-field>
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Edu Loan</mat-label>
                <input matInput type="number" formControlName="edu_loan">
              </mat-form-field>
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Bank 1</mat-label>
                <input matInput formControlName="bank_1">
              </mat-form-field>
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Bank 2</mat-label>
                <input matInput formControlName="bank_2">
              </mat-form-field>
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Bank 3</mat-label>
                <input matInput formControlName="bank_3">
              </mat-form-field>
              <div class="actions">
                <button mat-button type="button" (click)="cancel()">Cancel</button>
                <button mat-raised-button color="primary" type="submit" [disabled]="submitting">
                  @if (submitting) { <mat-spinner diameter="20"></mat-spinner> }
                  @else { Submit }
                </button>
              </div>
            </form>
          </div>
        </mat-tab>
        <mat-tab label="Completed Loan">
          <div class="tab-content">
            <form [formGroup]="completedForm" (ngSubmit)="submitCompleted()">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>SNO</mat-label>
                <input matInput type="number" formControlName="sno">
              </mat-form-field>
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Customer Name</mat-label>
                <input matInput formControlName="customer_name">
                @if (completedForm.get('customer_name')?.hasError('required')) {
                  <mat-error>Customer name is required</mat-error>
                }
              </mat-form-field>
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Phone</mat-label>
                <input matInput formControlName="phone">
              </mat-form-field>
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Loan Type</mat-label>
                <mat-select formControlName="loan_type">
                  <mat-option value="Housing Loan">Housing Loan</mat-option>
                  <mat-option value="LAP">LAP</mat-option>
                  <mat-option value="SME">SME</mat-option>
                  <mat-option value="HL">HL</mat-option>
                  <mat-option value="Personal">Personal</mat-option>
                  <mat-option value="Edu Loan">Edu Loan</mat-option>
                </mat-select>
              </mat-form-field>
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Loan Amount</mat-label>
                <input matInput type="number" formControlName="loan_amount">
              </mat-form-field>
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Interest Rate (%)</mat-label>
                <input matInput type="number" formControlName="interest_rate" step="0.01">
              </mat-form-field>
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>EMI</mat-label>
                <input matInput type="number" formControlName="emi" readonly>
              </mat-form-field>
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Month Label</mat-label>
                <input matInput formControlName="month_label" placeholder="e.g. APRIL">
              </mat-form-field>
              <div class="actions">
                <button mat-button type="button" (click)="cancel()">Cancel</button>
                <button mat-raised-button color="primary" type="submit" [disabled]="submitting">
                  @if (submitting) { <mat-spinner diameter="20"></mat-spinner> }
                  @else { Submit }
                </button>
              </div>
            </form>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .add-lead-container {
      padding: 24px;
    }
    .tab-content {
      padding: 24px;
      max-width: 600px;
    }
    mat-form-field {
      margin-bottom: 8px;
    }
    .actions {
      display: flex;
      gap: 16px;
      justify-content: flex-end;
      margin-top: 16px;
    }
    button {
      min-width: 100px;
    }
  `]
})
export class AddLeadComponent {
  runningForm: FormGroup;
  completedForm: FormGroup;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private leadsService: LeadsService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.runningForm = this.fb.group({
      sno: [null],
      customer_name: ['', Validators.required],
      lap: [null],
      sme: [null],
      hl: [null],
      personal: [null],
      edu_loan: [null],
      bank_1: [''],
      bank_2: [''],
      bank_3: ['']
    });

    this.completedForm = this.fb.group({
      sno: [null],
      customer_name: ['', Validators.required],
      phone: [''],
      loan_type: [''],
      loan_amount: [null],
      interest_rate: [null],
      emi: [{ value: null, disabled: true }],
      month_label: ['']
    });

    this.completedForm.valueChanges.subscribe(() => this.calculateEmi());
  }

  calculateEmi(): void {
    const amount = this.completedForm.get('loan_amount')?.value;
    const rate = this.completedForm.get('interest_rate')?.value;
    if (amount && rate) {
      const emi = amount * rate;
      this.completedForm.patchValue({ emi }, { emitEvent: false });
    }
  }

  submitRunning(): void {
    if (this.runningForm.invalid) {
      this.runningForm.markAllAsTouched();
      return;
    }
    this.submitting = true;
    const loan = this.runningForm.value;
    loan.sno = loan.sno || null;
    loan.lap = loan.lap || null;
    loan.sme = loan.sme || null;
    loan.hl = loan.hl || null;
    loan.personal = loan.personal || null;
    loan.edu_loan = loan.edu_loan || null;

    this.leadsService.addRunningLoan(loan).subscribe({
      next: () => {
        this.snackBar.open('Running loan added successfully', 'Close', { duration: 3000 });
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.submitting = false;
        this.snackBar.open('Failed to add loan', 'Close', { duration: 3000 });
      }
    });
  }

  submitCompleted(): void {
    if (this.completedForm.invalid) {
      this.completedForm.markAllAsTouched();
      return;
    }
    this.submitting = true;
    const loan = this.completedForm.getRawValue();
    loan.sno = loan.sno || null;
    loan.loan_amount = loan.loan_amount || null;
    loan.interest_rate = loan.interest_rate || null;
    loan.emi = (loan.loan_amount && loan.interest_rate) ? loan.loan_amount * loan.interest_rate : null;

    this.leadsService.addCompletedLoan(loan).subscribe({
      next: () => {
        this.snackBar.open('Completed loan added successfully', 'Close', { duration: 3000 });
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.submitting = false;
        this.snackBar.open('Failed to add loan', 'Close', { duration: 3000 });
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/dashboard']);
  }
}
