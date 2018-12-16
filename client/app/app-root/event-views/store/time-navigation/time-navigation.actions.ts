import { Injectable } from '@angular/core';
import { Operation } from './time-navigation';

@Injectable()
export class TimeNavigationActions {
  static readonly ADD = '[TIME_NAVIGATION]ADD';
  static readonly SUBTRACT = '[TIME_NAVIGATION]SUBTRACT';

  public add(amount: number) {
    return {
      type: TimeNavigationActions.ADD,
      payload: {
        amount,
        operation: Operation.Add
      }
    }
  }

  public subtract(amount: number) {
    return {
      type: TimeNavigationActions.SUBTRACT,
      payload: {
        amount,
        operation: Operation.Subtract
      }
    }
  }
}
