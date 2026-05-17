import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Button } from 'primeng/button';
import { PanelMenu } from 'primeng/panelmenu';
import { Toolbar } from 'primeng/toolbar';
import { Footer } from '../footer/footer';
import { Toast } from 'primeng/toast';
import { NotificationService } from '../../../core/services/notification';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, Toolbar, Button, PanelMenu, Footer, Toast],
  templateUrl: './app-layout.html',
  styleUrl: './app-layout.scss',
})
export class AppLayout {

  private notification = inject(NotificationService);
  sidebarVisible = signal(true);
  isDarkMode = signal(false);

  toggleDarkMode() {
    this.isDarkMode.set(!this.isDarkMode());
    document.querySelector('html')?.classList.toggle('dark-mode');
  }


  ngOnInit() {
    setTimeout(() => {
      this.notification.flushPending();
    }, 100);
  }

  menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'pi pi-home',
      routerLink: '/dashboard',
    },
    {
      label: 'Locador',
      icon: 'pi pi-building',
      expanded: true,
      items: [
        { label: 'Veículos', icon: 'pi pi-car', routerLink: '/landlord/vehicles' },
        { label: 'Locações', icon: 'pi pi-list', routerLink: '/landlord/rentals' },
      ],
    },
    {
      label: 'Locatário',
      icon: 'pi pi-user',
      expanded: true,
      items: [{ label: 'Minhas Locações', icon: 'pi pi-list', routerLink: '/tenant/rentals' }],
    },
  ];
}
