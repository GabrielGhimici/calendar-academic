import { EventState } from './event';
import { PayloadAction } from '../../../store/payload-action';
import { EventActions } from './event.actions';
import { State } from '@angular-redux/form/dist/source/state';

const INITIAL_STATE: EventState = {
  event: null,
  loading: true,
  saving: false,
  error: null
};

export function eventReducer(state: EventState = INITIAL_STATE, action: PayloadAction) {
  switch (action.type) {
    case EventActions.EVENT_SAVE_START: {
      return State.assign(state, [], {saving: true, error: null});
    }
    case EventActions.EVENT_SAVE_SUCCEED: {
      return State.assign(state, [], {saving: false, event: null});
    }
    case EventActions.EVENT_SAVE_FAILED: {
      return State.assign(state, [], {saving: false, error: action.error});
    }
    default:
      return state;
  }
}
