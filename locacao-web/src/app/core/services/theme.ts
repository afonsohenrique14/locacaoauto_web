import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  isDarkMode = signal<boolean>(
    localStorage.getItem('darkMode') === 'true'
  );

  constructor() {
    // aplica o tema salvo ao inicializar
    if (this.isDarkMode()) {
      document.querySelector('html')?.classList.add('dark-mode');
    }
  }

  toggle() {
    const newValue = !this.isDarkMode();
    this.isDarkMode.set(newValue);
    localStorage.setItem('darkMode', String(newValue));
    document.querySelector('html')?.classList.toggle('dark-mode');
  }
}
