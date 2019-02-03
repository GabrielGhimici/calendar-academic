import { Injectable } from '@angular/core';
import { CalendarView } from './time-navigation';

@Injectable()
export class TimeNavigationActions {
  static readonly ADD = '[TIME_NAVIGATION]ADD';
  static readonly SUBTRACT = '[TIME_NAVIGATION]SUBTRACT';

  public add(amount: number, context: CalendarView) {
    return {
      type: TimeNavigationActions.ADD,
      payload: {
        context,
        amount
      }
    }
  }

  public subtract(amount: number, context: CalendarView) {
    return {
      type: TimeNavigationActions.SUBTRACT,
      payload: {
        context,
        amount
      }
    }
  }
}
