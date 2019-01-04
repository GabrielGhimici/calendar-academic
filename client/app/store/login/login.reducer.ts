import { ILoginData } from './login-data';
import { PayloadAction } from 'client/app/store/payload-action';
import { LoginActions } from './login.actions';
import { State } from '@angular-redux/form/dist/source/state';

const INITIAL_STATE: ILoginData = {
  loggedIn: false,
  loading: false,
  error: null,
};

export function loginReducer(state: ILoginData = INITIAL_STATE, action: PayloadAction) {
  switch (action.type) {
    case LoginActions.LOGIN_STARTED : {
      return State.assign(state, [], {
          loggedIn: false,
          loading: true,
          error: null,
      });
    }
    case LoginActions.LOGIN_SUCCEEDED: {
      return State.assign(state, [], {
          loggedIn: action.payload,
          loading: false,
          error: null,
      });
    }
    case LoginActions.LOGIN_FAILED: {
      return State.assign(state, [], {
          loggedIn: false,
          loading: false,
          error: action.error,
      });
    }
    default: {
      return state;
    }
  }
}
