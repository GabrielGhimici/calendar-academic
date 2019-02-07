import { Injectable } from '@angular/core';
import { PayloadAction } from '../../../../store/payload-action';
import { CalendarEvent } from '../../../manage-event/store/event';

@Injectable()
export class EventListActions {
  static readonly LOAD_EVENTS = '[EVENT_LIST]LOAD_START';
  static readonly LOAD_EVENTS_SUCCEED = '[EVENT_LIST]LOAD_SUCCEED';
  static readonly LOAD_EVENTS_FAILED = '[EVENT_LIST]LOAD_FAILED';
  static readonly UPDATE_INTERVAL = '[EVENT_LIST]UPDATE_INTERVAL';

  loadEvents(start: any, end: any, privateEvents: boolean): PayloadAction {
    return {
      type: EventListActions.LOAD_EVENTS,
      payload: {
        start,
        end,
        privateEvents
      }
    }
  }
  loadEventsSucceed(data: Array<CalendarEvent>): PayloadAction {
    return {
      type: EventListActions.LOAD_EVENTS_SUCCEED,
      payload: data
    }
  }
  loadEventsFailed(error: any): PayloadAction {
    return {
      type: EventListActions.LOAD_EVENTS_FAILED,
      error: error
    }
  }
  updateInterval(start: any, end: any, privateEvents: boolean): PayloadAction {
    return {
      type: EventListActions.UPDATE_INTERVAL,
      payload: {
        start,
        end,
        privateEvents
      }
    }
  }
}
