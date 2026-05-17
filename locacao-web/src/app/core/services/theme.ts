import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  isDarkMode = signal(false);

  toggle() {
    this.isDarkMode.set(!this.isDarkMode());
    document.querySelector('html')?.classList.toggle('dark-mode');
  }
}
