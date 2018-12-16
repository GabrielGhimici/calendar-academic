import { TimeNavigation } from './time-navigation';
import { PayloadAction } from '../../../../store/payload-action';
import { TimeNavigationActions } from './time-navigation.actions';
import { State } from '@angular-redux/form/dist/source/state';

const INITIAL_STATE: TimeNavigation = {
  operation: null,
  amount: 0
};

export function timeNavigationReducer(state: TimeNavigation = INITIAL_STATE, action: PayloadAction<any, any>) {
  switch (action.type) {
    case TimeNavigationActions.ADD:
    case TimeNavigationActions.SUBTRACT: {
      return State.assign(state, [], action.payload);
    }
    default: {
      return state;
    }
  }
}
