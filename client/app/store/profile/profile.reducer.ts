import { ProfileState } from './profile';
import { PayloadAction } from '../payload-action';
import { ProfileActions } from './profile.actions';
import { State } from '@angular-redux/form/dist/source/state';

const INITIAL_STATE: ProfileState = {
  data: null,
  loading: true,
  error: null
};

export function profileReducer(state: ProfileState = INITIAL_STATE, action: PayloadAction) {
  switch (action.type) {
    case ProfileActions.PROFILE_LOAD_START:
      return State.assign(state, [], {loading: true, error: null});
    case ProfileActions.PROFILE_LOAD_SUCCEEDED:
      return State.assign(state, [], {loading: false, error: null, data: action.payload});
    case ProfileActions.PROFILE_LOAD_FAILED:
      return State.assign(state, [], {loading: false, error: action.error});
    default:
      return state;
  }
}
