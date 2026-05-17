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

  currentUser = signal<User | null>(null);

  register(email: string, password: string) {
    return this.http.post<User>(`${this.apiUrl}/auth/register`, { email, password }).pipe(
      tap(user =>{
        localStorage.setItem('token', user.token);
        this.currentUser.set(user);
      })
    );

  }

  login(email: string, password: string) {
    return this.http.post<User>(`${this.apiUrl}/auth/login`, { email, password }).pipe(
      tap(user =>{
        localStorage.setItem('token', user.token);
        this.currentUser.set(user);
      })
    );
  }

  isAuthenticated(): boolean {
    console.log(localStorage.getItem('token'))
    return !!localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    this.currentUser.set(null);
    this.router.navigate(['/']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

}
