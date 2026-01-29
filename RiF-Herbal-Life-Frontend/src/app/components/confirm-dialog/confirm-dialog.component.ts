import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, ConfirmDialog } from '../../services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="dialog" class="modal-overlay" (click)="onCancel()">
      <div class="modal-dialog" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>{{ dialog.title }}</h3>
        </div>
        <div class="modal-body">
          <p>{{ dialog.message }}</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" (click)="onCancel()">
            {{ dialog.cancelText || 'Cancel' }}
          </button>
          <button class="btn btn-danger" (click)="onConfirm()">
            {{ dialog.confirmText || 'Confirm' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent implements OnInit, OnDestroy {
  dialog: ConfirmDialog | null = null;
  private subscription: Subscription | undefined;

  constructor(private notificationService: NotificationService) { }

  ngOnInit() {
    this.subscription = this.notificationService.confirm$.subscribe(dialog => {
      this.dialog = dialog;
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onConfirm() {
    console.log('onConfirm called', this.dialog);
    if (this.dialog) {
      this.dialog.onConfirm();
      this.dialog = null; // Close the dialog
    }
  }

  onCancel() {
    if (this.dialog && this.dialog.onCancel) {
      this.dialog.onCancel();
    } else if (this.dialog) {
      // Default cancel behavior
      this.dialog = null;
    }
  }
}
