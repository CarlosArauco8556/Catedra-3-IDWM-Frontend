import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LocalStorageService } from '../services/local-storage.service';
import { JWTPayload } from '../interfaces/JWTpayload';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const localStorageService = inject(LocalStorageService);
  const token = localStorageService.getVariable('token');
  
  if (!token) {
    router.navigate(['/home']);
    return false;
  }

  const payload = decodeToken(token) as JWTPayload;
  
  if (!payload || !isTokenValid(payload)) {
    console.warn('Token inválido o expirado - Limpiando localStorage');
    localStorageService.removeVariable('token');
    router.navigate(['/home']);
    return false;
  }

  const timeToExpire = (payload.exp || 0) - Math.floor(Date.now() / 1000);
  if (timeToExpire < 300) { 
    console.warn('Token próximo a expirar');
  }

  const userRole = payload.role;
  const normalizedUserRole = userRole.toUpperCase();
  const requiredRoles = route.data['roles'] as Array<string>;
  
  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  if (requiredRoles.includes(normalizedUserRole)) {
    return true;
  } else {
    switch(normalizedUserRole) {
      case 'USER':
        if (localStorageService.getVariable('redirectAfterLogin'))
        {
          const redirect = localStorageService.getVariable('redirectAfterLogin');
          localStorageService.removeVariable('redirectAfterLogin');
          router.navigate([redirect]);
          break;
        }
        router.navigate(['/home']);
        break;
      default:
        router.navigate(['/unauthorized']);
    }
    return false;
  }
};

function decodeToken(token: string): JWTPayload | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(window.atob(base64));
  } catch (error) {
    console.error('Error decodificando el token:', error);
    return null;
  }
}

function isTokenValid(payload: JWTPayload): boolean {
  const currentTime = Math.floor(Date.now() / 1000);
  
  // Verificar si el token ha expirado
  if (payload.exp && currentTime > payload.exp) {
    console.warn('Token expirado');
    return false;
  }
  
  if (payload.nbf && currentTime < payload.nbf) {
    console.warn('Token aún no es válido');
    return false;
  }

  if (!payload.role) {
    console.warn('Token no contiene rol de usuario');
    return false;
  }
  
  return true;
};
