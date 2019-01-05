import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { isUndefined } from 'util';
import { LoginService } from 'client/app/login/login.service';
import {filter, map} from 'rxjs/operators';

@Injectable()
export class LoginGuard implements CanActivate {
  constructor(private loginService: LoginService,
              private router: Router) {
  }

  private getCookies() {
    const pairs = document.cookie.replace(/\s/g, '').split(';');
    const cookies = {};
    for (let i = 0; i < pairs.length; i++) {
      const pair = pairs[i].split('=');
      cookies[pair[0]] = pair[1];
    }
    return cookies;
  }

  canActivate() {
    return this.loginService.isLoggedIn
      .pipe(filter(value => !isUndefined(value)))
      .pipe(map(value => {
        const cookies = this.getCookies();
        if (!value || !cookies['CAToken']) {
          this.router.navigate(['/login']);
          return false;
        }
        return true;
      }));
  }
}
