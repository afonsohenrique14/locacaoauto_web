import { Component, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Button } from 'primeng/button';
import { Toolbar } from 'primeng/toolbar';
import { Footer } from '../../../shared/components/footer/footer';
import { Toast } from 'primeng/toast';

@Component({
  selector: 'app-public-layout',
  imports: [RouterOutlet, RouterLink, Button, Toolbar, Footer, Toast],
  templateUrl: './public-layout.html',
  styleUrl: './public-layout.scss',
})
export class PublicLayout {
  isDarkMode = signal(false);

  toggleDarkMode() {
    this.isDarkMode.set(!this.isDarkMode());
    document.querySelector('html')?.classList.toggle('dark-mode');
  }
}
