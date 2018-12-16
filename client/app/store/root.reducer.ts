import { combineReducers } from 'redux';
import { routerReducer } from '@angular-redux/router';
import { timeNavigationReducer } from '../app-root/event-views/store/time-navigation/time-navigation.reducer';

export const rootReducer = combineReducers({
  router: routerReducer,
  timeNavigation: timeNavigationReducer,
});
