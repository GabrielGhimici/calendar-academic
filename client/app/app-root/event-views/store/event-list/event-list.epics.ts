import { Injectable } from '@angular/core';
import { combineEpics, ofType } from 'redux-observable';
import { EventListActions } from './event-list.actions';
import { PayloadAction } from '../../../../store/payload-action';
import { catchError, map, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { CalendarEvent } from '../../../manage-event/store/event';
import * as moment from 'moment';
import { isNullOrUndefined } from '../../../../../utils/is-null-or-undefined';

@Injectable()
export class EventListEpics {
  constructor(
    private eventListActions: EventListActions,
    private http: HttpClient
  ) {};

  public createEpics() {
    return combineEpics(
      this.updateInterval(),
      this.loadEvents()
    );
  }

  private updateInterval() {
    return action$ => action$.pipe(
      ofType(EventListActions.UPDATE_INTERVAL),
      map((action: PayloadAction) => {
        return this.eventListActions.loadEvents(action.payload.start, action.payload.end);
      })
    )
  }

  private loadEvents() {
    return action$ => action$.pipe(
      ofType(EventListActions.LOAD_EVENTS),
      switchMap((action: PayloadAction) => {
        return this.http.post(
          '/api/event/serializedEvents',
          {
            afterDate: action.payload.start,
            beforeDate: action.payload.end
          }).pipe(
            switchMap((result: any) => {
              const parsedEvents: Array<CalendarEvent> = result.events ?
                result.events.map(event => this.adaptEvent(event)):
                [];
              return of(parsedEvents)
            }),
            map((data: Array<CalendarEvent>) => this.eventListActions.loadEventsSucceed(data)),
            catchError(err => of(this.eventListActions.loadEventsFailed(err)))
          )
      })
    )
  }

  private adaptEvent(event) {
    const newEvent = new CalendarEvent();
    newEvent.id = event.id;
    newEvent.name = event.name;
    newEvent.eventDescription = event.event_description;
    newEvent.location = event.location;
    newEvent.startDate = moment(event.start_date);
    newEvent.startHour = event.start_hour;
    newEvent.endDate = moment(event.end_date);
    newEvent.endHour = event.end_hour;
    newEvent.frequency = event.frequency;
    newEvent.recurringDays = event.recurring_days ? event.recurring_days.split(';') : [];
    newEvent.recurrent = event.recurrent;
    newEvent.isPublic = isNullOrUndefined(event.owner);
    return newEvent;
  }
}
