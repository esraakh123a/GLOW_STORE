import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);

  const token = localStorage.getItem('token');

  // مفيش Token
  if (!token) {
    return router.createUrlTree(['/login']);
  }

  try {

    const payload = JSON.parse(
      atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))
    );

    // Admin
    if (payload.role === 'admin') {
      return true;
    }

    // User عادي
    return router.createUrlTree(['/home']);

  } catch (error) {

    localStorage.removeItem('token');

    return router.createUrlTree(['/login']);
  }
};