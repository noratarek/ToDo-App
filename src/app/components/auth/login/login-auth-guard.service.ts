import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router } from '@angular/router';
import { UserService } from '../../../shared/services/user.service';


@Injectable()
export class LoginAuthGuardService implements CanActivate {

  constructor(private auth: UserService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    console.log('checking');
    return new Promise((resolve, reject) => {
      this.auth.isLoggedIn().subscribe(loggedIn => {
        if (loggedIn) {
          this.router.navigate(['']);
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }
}
