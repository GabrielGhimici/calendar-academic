import { Injectable } from '@angular/core';
import { PayloadAction } from '../payload-action';
import { Profile } from './profile';

@Injectable()
export class ProfileActions {
  static readonly PROFILE_LOAD_START = '[PROFILE]LOAD_START';
  static readonly PROFILE_LOAD_SUCCEEDED = '[PROFILE]LOAD_SUCCEEDED';
  static readonly PROFILE_LOAD_FAILED = '[PROFILE]LOAD_FAILED';
  loadProfile(): PayloadAction {
    return {
      type: ProfileActions.PROFILE_LOAD_START
    }
  }

  loadProfileSucceeded(data: Profile): PayloadAction {
    return {
      type: ProfileActions.PROFILE_LOAD_SUCCEEDED,
      payload: data
    }
  }

  loadProfileFailed(error: any): PayloadAction {
    return {
      type: ProfileActions.PROFILE_LOAD_FAILED,
      error
    }
  }
}
