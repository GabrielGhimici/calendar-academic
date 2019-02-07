import { combineReducers } from 'redux';
import { routerReducer } from '@angular-redux/router';
import { timeNavigationReducer } from '../app-root/event-views/store/time-navigation/time-navigation.reducer';
import { loginReducer } from '../login/store/login.reducer';
import { eventReducer } from '../app-root/manage-event/store/event.reducer';
import { eventListReducer } from '../app-root/event-views/store/event-list/event-list.reducer';
import { profileReducer } from './profile/profile.reducer';

export const rootReducer = combineReducers({
  router: routerReducer,
  timeNavigation: timeNavigationReducer,
  login: loginReducer,
  currentEvent: eventReducer,
  eventList: eventListReducer,
  profile: profileReducer
});
