import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { FloatLabel } from 'primeng/floatlabel';
import { Password } from 'primeng/password';
import { AuthPanel } from '../../../shared/components/auth-panel/auth-panel';

@Component({
  selector: 'app-login',
  imports: [Card, ReactiveFormsModule, FloatLabel, Button, Password, RouterLink, AuthPanel],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  rf = inject(FormBuilder);

  loginForm = this.rf.group({
    email: ['', Validators.required, Validators.email],
    password: ['', Validators.required, Validators.minLength(8)],
  });

  onSubmit() {
    console.log({
      ...this.loginForm.value,
    });
  }
}
