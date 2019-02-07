import { CalendarEvent } from '../../../manage-event/store/event';

export interface EventList {
  events: Array<CalendarEvent>;
  intervalStart: any;
  intervalEnd: any;
  loading: boolean;
  accepting: boolean;
  accepted: boolean;
  error: any;
}

