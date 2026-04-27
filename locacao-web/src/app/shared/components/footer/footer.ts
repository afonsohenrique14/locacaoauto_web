import { Component } from '@angular/core';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';

@Component({
  selector: 'app-footer',
  imports: [Button, Card],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {}
