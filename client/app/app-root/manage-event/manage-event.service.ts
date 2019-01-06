import { Injectable } from '@angular/core';
import { CalendarEvent } from './store/event';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ManageEventService {

  constructor(
    private http: HttpClient
  ) { }

  public saveEvent(event: CalendarEvent) {
    if (event.recurrent) {
      const payload = {
        name: event.name,
        event_description: event.eventDescription,
        location: event.location,
        start_date: event.startDate.unix() * 1000,
        end_date: event.endDate.unix() * 1000,
        start_hour: event.startHour,
        end_hour: event.endHour,
        frequency: event.frequency,
        recurring_days: event.recurringDays.join(',')
      };
      return this.http.put('/api/event/createPrivateRecurentEvent', payload);
    } else {
      const payload = {
        name: event.name,
        event_description: event.eventDescription,
        location: event.location,
        start_date: event.startDate.unix() * 1000,
        end_date: event.endDate.unix() * 1000,
        start_hour: event.startHour,
        end_hour: event.endHour,
      };
      return this.http.put('/api/event/createPrivateEvent', payload);
    }
  }
}
