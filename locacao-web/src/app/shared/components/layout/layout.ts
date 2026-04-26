import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Button } from 'primeng/button';
import { PanelMenu } from 'primeng/panelmenu';
import { Toolbar } from 'primeng/toolbar';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, Toolbar, Button, PanelMenu],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout {
  sidebarVisible = signal(true);
  isDarkMode = signal(false);

  toggleDarkMode() {
    this.isDarkMode.set(!this.isDarkMode());
    document.querySelector('html')?.classList.toggle('dark-mode');
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
