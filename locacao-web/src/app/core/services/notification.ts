import { inject, Injectable, signal } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private messageService = inject(MessageService)
  private pendingMessage = signal<{severity: string, summary: string, detail: string} | null>(null);

  success(message: string, title: string = 'Sucesso') {
    this.messageService.add({
      severity: 'success',
      summary: title,
      detail: message,
      life: 3000
    });
  }

  error(message: string, title: string = 'Erro') {
    this.messageService.add({
      severity: 'error',
      summary: title,
      detail: message,
      life: 5000
    });
  }

  info(message: string, title: string = 'Informação') {
    this.messageService.add({
      severity: 'info',
      summary: title,
      detail: message,
      life: 3000
    });
  }

  warn(message: string, title: string = 'Atenção') {
    this.messageService.add({
      severity: 'warn',
      summary: title,
      detail: message,
      life: 4000
    });
  }

  // para mensagens após navegação
  setPending(severity: string, summary: string, detail: string) {
    this.pendingMessage.set({ severity, summary, detail });
  }

  flushPending() {
    const msg = this.pendingMessage();
    if (msg) {
      this.messageService.add({ ...msg, life: 3000 });
      this.pendingMessage.set(null);
    }
  }

}
