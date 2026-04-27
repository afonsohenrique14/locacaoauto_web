import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';

@Component({
  selector: 'app-home',
  imports: [Button, Card, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  features = [
    {
      icon: 'pi pi-car',
      title: 'Controle de Frota',
      description:
        'Cadastre e gerencie seus veículos em um só lugar. Acompanhe status, quilometragem e disponibilidade em tempo real.',
    },
    {
      icon: 'pi pi-wallet',
      title: 'Gestão Financeira',
      description:
        'Parcelas, depósitos e recebimentos organizados automaticamente. Saiba exatamente o que entra e o que sai do seu negócio.',
    },
    {
      icon: 'pi pi-comments',
      title: 'Comunicação Direta',
      description:
        'Mantenha contato com seus locatários de forma simples e eficiente. Notificações automáticas e histórico completo.',
    },
  ];
}
