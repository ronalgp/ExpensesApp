import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(Auth);
  const router = inject(Router);
  if (authService.isAuthenticated()) {
    return true;
  }
  // Optionally, you can redirect to the login page
  router.navigate(['/login']);
  return false;
};
