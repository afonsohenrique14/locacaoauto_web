import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Button } from 'primeng/button';
import { PanelMenu } from 'primeng/panelmenu';
import { Toolbar } from 'primeng/toolbar';
import { Footer } from '../footer/footer';
import { Toast } from 'primeng/toast';
import { NotificationService } from '../../../core/services/notification';
import { AuthService } from '../../../core/services/auth';
import { ThemeService } from '../../../core/services/theme';


@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, Toolbar, Button, PanelMenu, Footer, Toast],
  templateUrl: './app-layout.html',
  styleUrl: './app-layout.scss',
})
export class AppLayout {

  private notification = inject(NotificationService);
  private authService = inject(AuthService)
  theme = inject(ThemeService);

// remove isDarkMode e toggleDarkMode
  sidebarVisible = signal(true);


  ngOnInit() {
    setTimeout(() => {
      this.notification.flushPending();
    }, 100);
  }

  logout(){
    this.authService.logout()
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
