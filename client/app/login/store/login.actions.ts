import {Injectable} from '@angular/core';

@Injectable()
export class LoginActions {
  public static readonly LOGIN_STARTED = '[LOGIN_ACTIONS]LOGIN_STARTED';
  public static readonly LOGIN_SUCCEEDED = '[LOGIN_ACTIONS]LOGIN_SUCCEEDED';
  public static readonly LOGIN_FAILED = '[LOGIN_ACTIONS]LOGIN_FAILED';

  constructor() {}

  startLogin(userData: any) {
    return {
        type: LoginActions.LOGIN_STARTED,
        payload: userData
    };
  }

  loginSucceeded(loginData: any) {
    return {
        type: LoginActions.LOGIN_SUCCEEDED,
        payload: loginData
    };
  }

  loginFailed(error: any) {
    return {
        type: LoginActions.LOGIN_FAILED,
        error
    };
  }
}
