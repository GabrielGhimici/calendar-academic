import { Component, OnDestroy } from '@angular/core';
import { isNullOrUndefined } from 'util';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { dispatch, select} from '@angular-redux/store';
import { filter } from 'rxjs/operators';
import { LoginActions } from '../store/login.actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnDestroy {
  @select(['login', 'loading']) public loginLoading$: Observable<any>;
  @select(['login', 'error']) public loginError$: Observable<any>;
  @select(['login', 'loggedIn']) public loggedIn$: Observable<any>;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor( private loginActions: LoginActions,
               private matSnackBar: MatSnackBar,
               private router: Router
              ) { }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  @dispatch()
  startLogin(formValue: any) {
    return this.loginActions.startLogin(formValue);
  }

  doLogin(formValue: any, formValidity: boolean) {
    if (formValidity) {
      this.startLogin(formValue);
      this.loggedIn$
        .pipe(
          filter((data) => !isNullOrUndefined(data))
        ).subscribe((data) => {
          if (data === true) {
            this.router.navigate(['/event']);
          }
        });
      this.loginError$
        .pipe(
          filter((data) => !isNullOrUndefined(data))
        ).subscribe(() => {
          this.matSnackBar.open(
            'Incorrect email or password',
            '',
            {
              duration: 2000,
              horizontalPosition: 'right',
            }
          );
        });
    }
  }
}
