import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Button } from 'primeng/button';
import { Toolbar } from 'primeng/toolbar';
import { Footer } from '../../../shared/components/footer/footer';
import { Toast } from 'primeng/toast';
import { ThemeService } from '../../../core/services/theme';

@Component({
  selector: 'app-public-layout',
  imports: [RouterOutlet, RouterLink, Button, Toolbar, Footer, Toast],
  templateUrl: './public-layout.html',
  styleUrl: './public-layout.scss',
})
export class PublicLayout {

  theme = inject(ThemeService);

}
