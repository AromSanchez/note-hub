import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Notification {
  message: string;
  type: 'success' | 'error';
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new BehaviorSubject<Notification | null>(null);
  
  getNotification(): Observable<Notification | null> {
    return this.notificationSubject.asObservable();
  }
  
  showNotification(message: string, type: 'success' | 'error' = 'success'): void {
    this.notificationSubject.next({ message, type });
    
    setTimeout(() => {
      this.notificationSubject.next(null);
    }, 3000);
  }
}