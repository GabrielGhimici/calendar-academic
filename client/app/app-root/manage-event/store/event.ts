import * as moment from 'moment';
import { Moment } from 'moment';

export interface EventState {
  event: any,
  loading: boolean,
  saving: boolean,
  error: any
}

export function getHour(withDelay: boolean = false) {
  let currentMinute = moment().minute();
  let currentHour = moment().hour();
  if(currentMinute >= 0 && currentMinute < 15) {
    currentMinute = 15;
    if (withDelay) {
      currentMinute = 30;
    }
  } else if(currentMinute >= 15 && currentMinute < 30) {
    currentMinute = 30;
    if (withDelay) {
      currentMinute = 45;
    }
  } else if(currentMinute >= 30 && currentMinute < 45) {
    currentMinute = 45;
    if (withDelay) {
      if(currentHour < 23) {
        currentHour++;
      } else {
        currentHour = 0;
      }
      currentMinute = 0;
    }
  } else if(currentMinute > 45) {
    if(currentHour < 23) {
      currentHour++;
    } else {
      currentHour = 0;
    }
    currentMinute = 0;
    if(withDelay) {
      currentMinute = 15;
    }
  }
  return `${normalizeNumber(currentHour)}:${normalizeNumber(currentMinute)}`;
}

function normalizeNumber(nr: number) {
  if(nr < 10) {
    return `0${nr}`
  }
  return `${nr}`;
}

export class CalendarEvent {
  constructor(
    public id: number = -1,
    public name: string = 'Event 1',
    public eventDescription: string = '',
    public location: string = '',
    public startDate: Moment = moment().utc().hour(0).minute(0).second(0),
    public endDate: Moment = moment().utc().hour(0).minute(0).second(0),
    public startHour: string = getHour(),
    public endHour: string = getHour(true),
    public isPublic: boolean = false,
    public owner: string = '',
    public recurrent: boolean = false,
    public frequency: number = 1,
    public recurringDays: string[] = ['monday'],
    public isInvitation: boolean = false,
    public invitationId: any = null
  ){}
}
