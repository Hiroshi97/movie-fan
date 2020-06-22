import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {
  currentUser: any;
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, router: RouterStateSnapshot): boolean | Promise<boolean> | Observable<boolean> | UrlTree {
    this.authService.user.subscribe(user => {
      this.currentUser = user
    });

    if(route.url[0].path === 'dashboard') {
      if (this.currentUser || sessionStorage.getItem('key'))
        return true;
      else this.router.navigate(['/login']);
    }
    else if (route.url[0].path === 'login' || route.url[0].path === 'signup') {
      if (!this.currentUser && !sessionStorage.getItem('key'))
        return true;
      else this.router.navigate(['/dashboard']);
    }
    
    
  }
}
