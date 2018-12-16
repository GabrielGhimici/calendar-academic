import { Injectable } from '@angular/core';
import { createEpicMiddleware } from 'redux-observable';
import { LoginActions } from './login.actions';
import { LoginService } from 'client/app/login/login.service';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import { Observable, of } from 'rxjs';
import {map, catchError} from 'rxjs/operators';

@Injectable()
export class LoginEpics {

  constructor(private loginService: LoginService,
              private loginActions: LoginActions) {}
/*
  public createEpic() {
    return createEpicMiddleware(this.loginEpic());
  }
*/
  private loginEpic() {
    return action$ => action$
      .ofType(LoginActions.LOGIN_STARTED)
      .switchMap(action => this.loginService.logIn(action.payload)
        .pipe(map(data => this.loginActions.loginSucceeded(data['OK'])))
        .pipe(catchError(data => of(this.loginActions.loginFailed(data))))
      );
  }
}
