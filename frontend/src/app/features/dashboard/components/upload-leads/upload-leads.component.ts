import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { LeadsService } from '../../../../core/services/leads.service';

@Component({
  selector: 'app-upload-leads',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  template: `
    <div class="upload-container">
      <mat-card class="upload-card">
        <mat-card-header>
          <mat-card-title>Upload Excel File</mat-card-title>
          <mat-card-subtitle>Upload a .xlsx file with loan data</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <div class="drop-zone"
               [class.drag-over]="isDragOver"
               (dragover)="onDragOver($event)"
               (dragleave)="onDragLeave($event)"
               (drop)="onDrop($event)"
               (click)="fileInput.click()">
            <input #fileInput type="file" accept=".xlsx" (change)="onFileSelected($event)" hidden>
            <mat-icon class="upload-icon">cloud_upload</mat-icon>
            <p>Drag and drop your Excel file here</p>
            <p>or click to select</p>
          </div>

          @if (selectedFile) {
            <div class="file-preview">
              <mat-icon>description</mat-icon>
              <span>{{ selectedFile.name }}</span>
              <button mat-icon-button (click)="clearFile()">
                <mat-icon>close</mat-icon>
              </button>
            </div>
          }

          @if (uploading) {
            <div class="progress-container">
              <mat-spinner diameter="40"></mat-spinner>
              <p>Uploading and processing...</p>
            </div>
          }
        </mat-card-content>
        <mat-card-actions align="end">
          <button mat-button (click)="cancel()">Cancel</button>
          <button mat-raised-button color="primary" [disabled]="!selectedFile || uploading" (click)="upload()">
            @if (uploading) {
              <mat-spinner diameter="20"></mat-spinner>
            } @else {
              Upload & Import
            }
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .upload-container {
      display: flex;
      justify-content: center;
      padding: 48px;
    }
    .upload-card {
      width: 500px;
      padding: 24px;
    }
    .drop-zone {
      border: 2px dashed #ccc;
      border-radius: 8px;
      padding: 48px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s;
      background: #fafafa;
    }
    .drop-zone:hover, .drop-zone.drag-over {
      border-color: #3f51b5;
      background: #e8eaf6;
    }
    .upload-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #3f51b5;
    }
    .file-preview {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 16px;
      background: #e8eaf6;
      border-radius: 4px;
      margin-top: 16px;
    }
    .progress-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 24px;
    }
  `]
})
export class UploadLeadsComponent {
  selectedFile: File | null = null;
  isDragOver = false;
  uploading = false;

  constructor(
    private leadsService: LeadsService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }

  handleFile(file: File): void {
    if (!file.name.endsWith('.xlsx')) {
      this.snackBar.open('Only .xlsx files are allowed', 'Close', { duration: 3000 });
      return;
    }
    this.selectedFile = file;
  }

  clearFile(): void {
    this.selectedFile = null;
  }

  upload(): void {
    if (!this.selectedFile) return;

    this.uploading = true;
    this.leadsService.uploadExcel(this.selectedFile).subscribe({
      next: (response) => {
        this.uploading = false;
        this.snackBar.open(
          `Imported ${response.runningLoansImported} running loans and ${response.completedLoansImported} completed loans`,
          'Close',
          { duration: 5000 }
        );
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.uploading = false;
        this.snackBar.open('Failed to upload file', 'Close', { duration: 3000 });
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/dashboard']);
  }
}
