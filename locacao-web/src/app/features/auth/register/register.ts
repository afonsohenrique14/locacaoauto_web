import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Divider } from 'primeng/divider';
import { FloatLabel } from 'primeng/floatlabel';
import { Password } from 'primeng/password';
import { AuthPanel } from '../../../shared/components/auth-panel/auth-panel';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-register',
  imports: [
    Card,
    FloatLabel,
    ReactiveFormsModule,
    Password,
    Divider,
    Button,
    RouterLink,
    AuthPanel,
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]],
  });

  onSubmit() {
    if (this.registerForm.invalid) return;

    const { password, confirmPassword, email } = this.registerForm.value;

    if (password !== confirmPassword) {
      this.registerForm.get('confirmPassword')?.setErrors({ mismatch: true });
      return;
    }

        this.authService.register(email!, password!).subscribe(
          {
            next: (user) =>{
              this.router.navigate(['/app']);
            },
            error: (err) => {
              console.error('Registration failed', err);
              // Here you can also set form errors based on the response
            }
          }
        )
  }
}
