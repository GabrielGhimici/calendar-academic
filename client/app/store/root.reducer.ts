import { combineReducers } from 'redux';
import { routerReducer } from '@angular-redux/router';
import { timeNavigationReducer } from '../app-root/event-views/store/time-navigation/time-navigation.reducer';
import { loginReducer } from '../login/store/login.reducer';

export const rootReducer = combineReducers({
  router: routerReducer,
  timeNavigation: timeNavigationReducer,
  login: loginReducer
});
