import { Injectable } from '@angular/core';
import { combineEpics, ofType } from 'redux-observable';
import { EventListActions } from './event-list.actions';
import { PayloadAction } from '../../../../store/payload-action';
import { catchError, delay, map, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { forkJoin, of } from 'rxjs';
import { CalendarEvent } from '../../../manage-event/store/event';
import * as moment from 'moment';
import { isNullOrUndefined } from '../../../../../utils/is-null-or-undefined';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class EventListEpics {
  constructor(
    private eventListActions: EventListActions,
    private http: HttpClient,
    private matSnackBar: MatSnackBar,
  ) {};

  public createEpics() {
    return combineEpics(
      this.updateInterval(),
      this.loadEvents(),
      this.acceptInvitation()
    );
  }

  private updateInterval() {
    return action$ => action$.pipe(
      ofType(EventListActions.UPDATE_INTERVAL),
      map((action: PayloadAction) => {
        return this.eventListActions.loadEvents(action.payload.start, action.payload.end, action.payload.privateEvents);
      })
    )
  }

  private loadEvents() {
    return action$ => action$.pipe(
      ofType(EventListActions.LOAD_EVENTS),
      switchMap((action: PayloadAction) => {
        if (action.payload.privateEvents) {
          return this.http.post(
            '/api/event/serializedPrefferedEvents',
            {
              afterDate: action.payload.start,
              beforeDate: action.payload.end
            }).pipe(
              switchMap((result: any) => {
                const parsedEvents: Array<CalendarEvent> = result.events ?
                  result.events.map(event => this.adaptEvent(event)):
                  [];
                return of(parsedEvents);
              }),
              map((data: Array<CalendarEvent>) => this.eventListActions.loadEventsSucceed(data)),
              catchError(err => of(this.eventListActions.loadEventsFailed(err)))
            )
        }
        return forkJoin(
          this.http.post(
          '/api/event/serializedEvents',
          {
            afterDate: action.payload.start,
            beforeDate: action.payload.end
          }),
          this.http.get('/api/event/invitations')
        ).pipe(
          switchMap(([eventList, invitationList]: any[]) => {
            const parsedEvents: Array<CalendarEvent> = eventList.events ?
              eventList.events.map(event => this.adaptEvent(event)):
              [];
            const additionalEvents: Array<CalendarEvent> = invitationList.invitations ?
              invitationList.invitations.map(inv => this.adaptEvent(inv.event, inv.id)):
              [];
            return of([...parsedEvents, ...additionalEvents]);
          }),
          map((data: Array<CalendarEvent>) => this.eventListActions.loadEventsSucceed(data)),
          catchError(err => of(this.eventListActions.loadEventsFailed(err)))
        )
      })
    )
  }

  private acceptInvitation() {
    return action$ => action$.pipe(
      ofType(EventListActions.ACCEPT_INVITATION),
      switchMap((action: PayloadAction) => {
        return  this.http.put('/api/event/respond', {id: action.payload, response: true}).pipe(
          map((_) => {
            this.matSnackBar.open(
              'Invitatia a fost acceptata.',
              '',
              {
                duration: 2000,
                horizontalPosition: 'right',
              }
            );
            return this.eventListActions.acceptInvitationSucceeded()
          }),
          catchError(err => {
            this.matSnackBar.open(
              'Invitatia nu a putut fi acceptata.',
              '',
              {
                duration: 2000,
                horizontalPosition: 'right',
              }
            );
            return of(this.eventListActions.acceptInvitationFailed(err))
          })
        );
      })
    )
  }

  private adaptEvent(event, invitationId: any = null) {
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
    newEvent.owner = event.owner || '';
    newEvent.isInvitation = !isNullOrUndefined(invitationId);
    newEvent.invitationId = invitationId;
    return newEvent;
  }
}
