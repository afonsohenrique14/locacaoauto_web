import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const contextGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  const context = authService.getContext()

  if(context === 'landlord'){
    return router.createUrlTree(['/app/landlord'])
  }

  if(context === 'tenant'){
    return router.createUrlTree(['/app/tenant'])
  }


  return true;
};
