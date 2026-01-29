import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, Notification } from '../../services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notification-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notification-container">
      <div *ngFor="let notification of notifications" 
           [class]="'notification notification-' + notification.type"
           [@slideIn]>
        <div class="notification-icon">
          <span *ngIf="notification.type === 'success'">✓</span>
          <span *ngIf="notification.type === 'error'">✕</span>
          <span *ngIf="notification.type === 'info'">ℹ</span>
          <span *ngIf="notification.type === 'warning'">⚠</span>
        </div>
        <div class="notification-message">{{ notification.message }}</div>
        <button class="notification-close" (click)="remove(notification.id)">×</button>
      </div>
    </div>
  `,
  styleUrls: ['./notification-container.component.css']
})
export class NotificationContainerComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  private subscription: Subscription | undefined;

  constructor(private notificationService: NotificationService) { }

  ngOnInit() {
    this.subscription = this.notificationService.notifications$.subscribe(notification => {
      this.notifications.push(notification);

      if (notification.duration) {
        setTimeout(() => {
          this.remove(notification.id);
        }, notification.duration);
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  remove(id: string) {
    this.notifications = this.notifications.filter(n => n.id !== id);
  }
}
