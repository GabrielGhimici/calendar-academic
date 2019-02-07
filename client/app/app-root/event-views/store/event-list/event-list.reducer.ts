import { EventList } from './event-list';
import { PayloadAction } from '../../../../store/payload-action';
import { EventListActions } from './event-list.actions';
import { State } from '@angular-redux/form/dist/source/state';

const INITIAL_STATE: EventList = {
  events: [],
  intervalStart: null,
  intervalEnd: null,
  loading: true,
  accepting: false,
  accepted: false,
  error: null
};

export function eventListReducer(state: EventList = INITIAL_STATE, action: PayloadAction) {
  switch (action.type) {
    case EventListActions.RESET_ACCEPTED:
      return State.assign(state, [], {accepted: false});
    case EventListActions.ACCEPT_INVITATION:
      return State.assign(state, [], {accepting: true, accepted: false, error: null});
    case EventListActions.ACCEPT_INVITATION_SUCCEEDED:
      return State.assign(state, [], {accepting: false, accepted: true, error: null});
    case  EventListActions.ACCEPT_INVITATION_FAILED:
      return State.assign(state, [], {accepting: false, accepted: false, error: action.error});
    case EventListActions.LOAD_EVENTS:
      return State.assign(state, [], {loading: true, error: null});
    case EventListActions.LOAD_EVENTS_SUCCEED:
      return State.assign(state, [], {loading: false, error: null, events: action.payload});
    case EventListActions.LOAD_EVENTS_FAILED:
      return State.assign(state, [], {loading: false, error: action.error});
    case EventListActions.UPDATE_INTERVAL:
      return State.assign(state, [], {intervalStart: action.payload.start, intervalEnd: action.payload.end});
    default:
      return state;
  }
}
