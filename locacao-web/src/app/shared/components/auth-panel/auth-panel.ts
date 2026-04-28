import { Component } from '@angular/core';

@Component({
  selector: 'app-auth-panel',
  imports: [],
  templateUrl: './auth-panel.html',
  styleUrl: './auth-panel.scss',
})
export class AuthPanel {
  features = [
    { icon: 'pi pi-car', text: 'Controle total da sua frota' },
    { icon: 'pi pi-wallet', text: 'Gestão financeira integrada' },
    { icon: 'pi pi-comments', text: 'Comunicação direta com locatários' },
  ];
}
