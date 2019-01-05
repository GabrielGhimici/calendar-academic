import { TimeNavigation } from './time-navigation';
import { PayloadAction } from '../../../../store/payload-action';
import { TimeNavigationActions } from './time-navigation.actions';
import { State } from '@angular-redux/form/dist/source/state';
import * as moment from 'moment';
import { CalendarView } from '../../event-views.component';

const INITIAL_STATE: TimeNavigation = {
  currentDate: moment(),
  periodStart: null,
  periodEnd: null
};

export function timeNavigationReducer(state: TimeNavigation = INITIAL_STATE, action: PayloadAction) {
  switch (action.type) {
    case TimeNavigationActions.ADD: {
      switch (action.payload.context) {
        case CalendarView.MONTH: {
          const newIncreasedDate = moment(state.currentDate).add(action.payload.amount, 'months');
          const limits = getMonthLimits(newIncreasedDate);
          return State.assign(state, [], {
            currentDate: newIncreasedDate,
            periodStart: limits.firstDayOfGrid,
            periodEnd: limits.endDayOfGrid
          });
        }
        case CalendarView.WEEK: {
          const newIncreasedDate = moment(state.currentDate).add(action.payload.amount, 'weeks');
          const limits = getWeekLimits(newIncreasedDate);
          return State.assign(state, [], {
            currentDate: newIncreasedDate,
            periodStart: limits.firstDayOfGrid,
            periodEnd: limits.endDayOfGrid
          });
        }
        case CalendarView.DAY: {
          const newIncreasedDate = moment(state.currentDate).add(action.payload.amount, 'days');
          return State.assign(state, [], {
            currentDate: newIncreasedDate,
            periodStart: newIncreasedDate,
            periodEnd: newIncreasedDate
          });
        }
        default: {
          return state;
        }
      }
    }
    case TimeNavigationActions.SUBTRACT: {
      switch (action.payload.context) {
        case CalendarView.MONTH: {
          const newDecreasedDate = moment(state.currentDate).subtract(action.payload.amount, 'months');
          const limits = getMonthLimits(newDecreasedDate);
          return State.assign(state, [], {
            currentDate: newDecreasedDate,
            periodStart: limits.firstDayOfGrid,
            periodEnd: limits.endDayOfGrid
          });
        }
        case CalendarView.WEEK: {
          const newDecreasedDate = moment(state.currentDate).subtract(action.payload.amount, 'weeks');
          const limits = getWeekLimits(newDecreasedDate);
          return State.assign(state, [], {
            currentDate: newDecreasedDate,
            periodStart: limits.firstDayOfGrid,
            periodEnd: limits.endDayOfGrid
          });
        }
        case CalendarView.DAY: {
          const newDecreasedDate = moment(state.currentDate).subtract(action.payload.amount, 'days');
          return State.assign(state, [], {
            currentDate: newDecreasedDate,
            periodStart: newDecreasedDate,
            periodEnd: newDecreasedDate
          });
        }
        default: {
          return state;
        }
      }
    }
    default: {
      return state;
    }
  }
}

function getMonthLimits(currentDate: any) {
  let firstOfMonth = moment(currentDate).startOf('month').day() - 1;
  firstOfMonth = firstOfMonth < 0 ? 6 : firstOfMonth;
  const firstDayOfGrid = moment(currentDate).startOf('month').subtract(firstOfMonth, 'days');
  const endDayOfGrid  = moment(firstDayOfGrid).date(firstDayOfGrid.date() + 41);
  return {
    firstDayOfGrid,
    endDayOfGrid
  }
}

function getWeekLimits(currentDate: any) {
  const firstDayOfGrid = moment(currentDate).startOf('week');
  const endDayOfGrid  = moment(firstDayOfGrid).date(firstDayOfGrid.date() + 6);
  return {
    firstDayOfGrid,
    endDayOfGrid
  }
}
