import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Notification {
    id: string;
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
    duration?: number;
}

export interface ConfirmDialog {
    id: string;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel?: () => void;
}

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private notificationSubject = new Subject<Notification>();
    private confirmSubject = new Subject<ConfirmDialog | null>();

    notifications$ = this.notificationSubject.asObservable();
    confirm$ = this.confirmSubject.asObservable();

    success(message: string, duration: number = 3000) {
        this.show('success', message, duration);
    }

    error(message: string, duration: number = 4000) {
        this.show('error', message, duration);
    }

    info(message: string, duration: number = 3000) {
        this.show('info', message, duration);
    }

    warning(message: string, duration: number = 3000) {
        this.show('warning', message, duration);
    }

    private show(type: Notification['type'], message: string, duration: number) {
        const notification: Notification = {
            id: Math.random().toString(36).substr(2, 9),
            type,
            message,
            duration
        };
        this.notificationSubject.next(notification);
    }

    confirm(title: string, message: string, confirmText: string = 'Confirm', cancelText: string = 'Cancel'): Promise<boolean> {
        return new Promise((resolve) => {
            const dialog: ConfirmDialog = {
                id: Math.random().toString(36).substr(2, 9),
                title,
                message,
                confirmText,
                cancelText,
                onConfirm: () => {
                    this.confirmSubject.next(null);
                    resolve(true);
                },
                onCancel: () => {
                    this.confirmSubject.next(null);
                    resolve(false);
                }
            };
            this.confirmSubject.next(dialog);
        });
    }
}
