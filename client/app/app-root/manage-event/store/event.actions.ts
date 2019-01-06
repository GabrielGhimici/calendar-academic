import { Injectable } from '@angular/core';
import { CalendarEvent } from './event';
import { PayloadAction } from '../../../store/payload-action';

@Injectable()
export class EventActions {
  public static readonly EVENT_SAVE_START = '[EVENT]SAVE_START';
  public static readonly EVENT_SAVE_SUCCEED = '[EVENT]SAVE_SUCCEED';
  public static readonly EVENT_SAVE_FAILED = '[EVENT]SAVE_FAILED';

  public saveStart(event: CalendarEvent): PayloadAction {
    return {
      type: EventActions.EVENT_SAVE_START,
      payload: event
    }
  }

  public saveSucceed(): PayloadAction {
    return {
      type: EventActions.EVENT_SAVE_SUCCEED,
    }
  }

  public saveFailed(error: any): PayloadAction {
    return {
      type: EventActions.EVENT_SAVE_FAILED,
      error: error
    }
  }
}
