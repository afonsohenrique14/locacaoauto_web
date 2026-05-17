import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { FloatLabel } from 'primeng/floatlabel';
import { Password } from 'primeng/password';
import { AuthPanel } from '../../../shared/components/auth-panel/auth-panel';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  imports: [Card, ReactiveFormsModule, FloatLabel, Button, Password, RouterLink, AuthPanel],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  onSubmit() {
   if (this.loginForm.invalid) return;

    const { password, email } = this.loginForm.value;

      this.authService.login(email!, password!).subscribe(
        {
          next: (user) =>{
            this.router.navigate(['/app']);
          },
          error: (err) => {
            console.error('Login failed', err);
            // Here you can also set form errors based on the response
          }
        }
      )
  }
}
