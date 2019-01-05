import { Injectable } from '@angular/core';
import { combineEpics, ofType } from 'redux-observable';
import { LoginActions } from './login.actions';
import { LoginService } from 'client/app/login/login.service';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { PayloadAction } from '../../store/payload-action';

@Injectable()
export class LoginEpics {

  constructor(private loginService: LoginService,
              private loginActions: LoginActions) {}

  public createEpic() {
    return combineEpics(this.loginEpic());
  }

  private loginEpic() {
    return action$ => action$
      .pipe(
        ofType(LoginActions.LOGIN_STARTED),
        switchMap((action: PayloadAction) => this.loginService.logIn(action.payload)
          .pipe(
            map(data => this.loginActions.loginSucceeded(data['OK'])),
            catchError(data => of(this.loginActions.loginFailed(data)))
          )
        )
      );
  }
}
