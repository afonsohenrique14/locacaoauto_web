import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
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
  private authService = inject(AuthService);
  private router = inject(Router);
  theme = inject(ThemeService);

  sidebarVisible = signal(true);

  private landlordMenu: MenuItem[] = [
    { label: 'Dashboard', icon: 'pi pi-home', routerLink: '/app/dashboard' },
    {
      label: 'Locador',
      icon: 'pi pi-building',
      expanded: true,
      items: [
        { label: 'Veículos', icon: 'pi pi-car', routerLink: '/app/landlord/vehicles' },
        { label: 'Locações', icon: 'pi pi-list', routerLink: '/app/landlord/rentals' },
      ],
    },
    { separator: true },
    {
      label: 'Alugar um veículo',
      icon: 'pi pi-key',
      command: () => this.switchContext()
    }
  ];

  private tenantMenu: MenuItem[] = [
    { label: 'Dashboard', icon: 'pi pi-home', routerLink: '/app/dashboard' },
    {
      label: 'Locatário',
      icon: 'pi pi-user',
      expanded: true,
      items: [
        { label: 'Minhas Locações', icon: 'pi pi-list', routerLink: '/app/tenant/rentals' },
      ],
    },
    { separator: true },
    {
      label: 'Locar meu veículo',
      icon: 'pi pi-map',
      command: () => this.switchContext()
    }
  ];

  private defaultMenu: MenuItem[] = [
    { label: 'Dashboard', icon: 'pi pi-home', routerLink: '/app/dashboard' },
  ];

  menuItems = computed(() => {
    const context = this.authService.getContext();
    console.log(context);
    if (context === 'landlord') return this.landlordMenu;
    if (context === 'tenant') return this.tenantMenu;
    return this.defaultMenu;
  });

  ngOnInit() {
    setTimeout(() => this.notification.flushPending(), 100);
  }



  switchContext() {
    this.authService.clearContext();
    this.router.navigate(['/app/dashboard']);
  }

  logout() {
    // this.authService.clearContext();
    this.authService.logout();
  }
}
