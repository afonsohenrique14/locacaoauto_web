import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';
import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http =  inject(HttpClient);
  private router = inject(Router);

  private readonly apiUrl = environment.apiUrl;

  currentUser = signal<User | null>(this.loadUser());

  private loadUser(): User | null {
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  }

  private saveUser(user: User) {
    localStorage.setItem('token', user.token);
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUser.set(user);
  }

  navigateAfterAuth(user: User, returnUrl?: string) {
      if (returnUrl && returnUrl !== '/auth/login') {
        this.router.navigate([returnUrl]);
        return;
      }

      if (user.personId) {
        this.router.navigate(['/app']);
      } else {
        this.router.navigate(['/app/complete-profile']);
      }
  }

  register(email: string, password: string) {
    return this.http.post<User>(`${this.apiUrl}/auth/register`, { email, password }).pipe(
    tap(user => this.saveUser(user))
    );

  }

  login(email: string, password: string) {
    return this.http.post<User>(`${this.apiUrl}/auth/login`, { email, password }).pipe(
    tap(user => this.saveUser(user))
    );
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUser.set(null);
    this.router.navigate(['/']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private _context = signal<'landlord' | 'tenant' | null>(
    localStorage.getItem('context') as 'landlord' | 'tenant' | null
  );

  context = this._context.asReadonly();

  setContext(context: 'landlord' | 'tenant') {
    localStorage.setItem('context', context);
    this._context.set(context);
  }

  clearContext() {
    localStorage.removeItem('context');
    this._context.set(null);
  }

  getContext(): 'landlord' | 'tenant' | null {
    return this._context();
  }

}
