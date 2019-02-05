import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';
import { select } from '@angular-redux/store';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { isNullOrUndefined } from '../../../../utils/is-null-or-undefined';
import { CalendarEvent } from '../../manage-event/store/event';

export interface CalendarDate {
  mDate: moment.Moment;
  events?: any;
  today?: boolean;
}

@Component({
  selector: 'month',
  templateUrl: './month-view.component.html',
  styleUrls: ['./month-view.component.scss']
})
export class MonthViewComponent implements OnInit {
  public rowSize: number = 7;
  public columnSize: number = 6;
  public currentDate = moment();
  public dayNames = ['Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă', 'Duminică'];
  public recurrenceDays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  public weeks: CalendarDate[][] = [];
  private events: Array<CalendarEvent> = [];
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  @select(['timeNavigation', 'currentDate']) readonly timeNavigation$: Observable<any>;
  @select(['eventList', 'events']) readonly events$: Observable<any>;

  @ViewChild('monthCell') monthCell;
  private numberOfEventsShown = 0;
  private eventHeight = 14;
  private unavailableSpace = 32;

  constructor() { }

  ngOnInit() {
    this.timeNavigation$.pipe(
      takeUntil(this.ngUnsubscribe),
      filter(data => !isNullOrUndefined(data))
    ).subscribe((data) => {
      this.currentDate = data;
      this.generateCalendar();
    });
    this.events$.pipe(
      takeUntil(this.ngUnsubscribe),
      filter(data =>  !isNullOrUndefined(data))
    ).subscribe((data) => {
      this.events = data.map(event => {
        event.colorClass = `color-${this.getRandomIntInclusive(1,12) * 10}`;
        return event;
      });
      this.generateCalendar();
    });
  }

  ngAfterViewInit() {
    const remainingSpace = this.monthCell.nativeElement.clientHeight - this.unavailableSpace;
    this.numberOfEventsShown = Math.trunc(remainingSpace / this.eventHeight);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  isToday(date: moment.Moment): boolean {
    return moment().isSame(moment(date), 'day');
  }

  isAfterToday(date: moment.Moment): boolean {
    return moment(date).isAfter(moment(), 'day');
  }

  isSelectedMonth(date: moment.Moment): boolean {
    return moment(date).isSame(this.currentDate, 'month');
  }

  private getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  generateCalendar(): void {
    let dates = this.fillDates(this.currentDate);
    dates.forEach((week: CalendarDate[]) => {
      week.map((element) => {
        element.events = this.events.filter((event: CalendarEvent) => {
          if (!event.recurrent) {
            return element.mDate.isBetween(event.startDate, event.endDate, null, '[]');
          } else {
            const dayInRange = element.mDate.isBetween(event.startDate, event.endDate, null, '[]');
            const firstDayOfBaseWeek = event.startDate.startOf('week');
            const start = firstDayOfBaseWeek.date();
            const baseWeek =  _.range(start, start + 7)
              .map((date: number): moment.Moment => {
                return moment(firstDayOfBaseWeek).date(date);
              })
              .filter((date: moment.Moment) => {
                return event.recurringDays.map(day => this.recurrenceDays.indexOf(day)).indexOf(date.day()) >= 0;
              });
            const eventDays = this.calculatePossibleDates(baseWeek, event.endDate, event.frequency)
              .filter(day => day.isSameOrAfter(event.startDate));
            const isDayOfRecurrence = eventDays.reduce((accumulator, day) => {
              accumulator = accumulator || element.mDate.isSame(day);
              return accumulator;
            }, false);
            return dayInRange && isDayOfRecurrence;
          }
        });
        return element;
      });
    });
    this.weeks = dates;
  }

  allPassed(dates: Array<moment.Moment>, targetDate: moment.Moment) {
    return dates.reduce((accumulator, date) => {
      accumulator = accumulator && date.isSameOrAfter(targetDate);
      return accumulator;
    }, true)
  }

  calculatePossibleDates(baseDates: Array<moment.Moment>, targetDate: moment.Moment, frequency: number) {
    let dates = [];
    let calculatedDates = baseDates.slice();
    dates = dates.concat(baseDates.slice());
    let addFactor = frequency;
    while (!this.allPassed(calculatedDates, targetDate)) {
      calculatedDates = baseDates.slice().map(el => moment(el).add(addFactor, 'w'));
      dates = dates.concat(calculatedDates.slice());
      addFactor += frequency;
    }
    return dates.filter(date => {
      return date.isSameOrBefore(targetDate);
    });
  }

  fillDates(currentMoment: moment.Moment): CalendarDate[][] {
    let firstOfMonth = moment(currentMoment).startOf('month').day() - 1;
    firstOfMonth = firstOfMonth < 0 ? 6 : firstOfMonth;
    const firstDayOfGrid = moment(currentMoment).startOf('month').subtract(firstOfMonth, 'days');
    const start = firstDayOfGrid.date();
    return _.range(start, start + 42)
      .map((date: number): CalendarDate => {
        const d = moment(firstDayOfGrid).date(date);
        return {
          today: this.isToday(d),
          events: null,
          mDate: d,
        };
      })
      .reduce((accumulator, currentValue, currentIndex) => {
        const row: number = Math.trunc(currentIndex / this.rowSize);
        if (!accumulator[row]) {
          accumulator.push([]);
        }
        accumulator[row].push(currentValue);
        return accumulator;
      }, []);
  }

  moreLabel(number) {
    if(number == 1) {
      return `+${number} eveniment`;
    }
    return `+${number} evenimente`;
  }
}
