import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';
import { select } from '@angular-redux/store';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { isNullOrUndefined } from '../../../../utils/is-null-or-undefined';
import { Operation } from '../store/time-navigation/time-navigation';

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
  public weeks: CalendarDate[][] = [];
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  @select(['timeNavigation']) readonly timeNavigation$: Observable<any>;

  constructor() { }

  ngOnInit() {
    this.generateCalendar();
    this.timeNavigation$.pipe(
      takeUntil(this.ngUnsubscribe),
      filter(data => !isNullOrUndefined(data.operation))
    ).subscribe((data) => {
      if (data.amount > 0) {
        if (data.operation === Operation.Add) {
          this.nextMonth(data.amount);
        }
        if (data.operation === Operation.Subtract) {
          this.prevMonth(data.amount);
        }
      }
    })
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnChanges(changes) {
    if (changes.events && changes.events.currentValue) {
      this.generateCalendar();
    }
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

  prevMonth(differentAmount?: number): void {
    const amount = differentAmount || 1;
    this.currentDate = moment(this.currentDate).subtract(amount, 'months');
    this.generateCalendar();
  }

  nextMonth(differentAmount?: number): void {
    const amount = differentAmount || 1;
    this.currentDate = moment(this.currentDate).add(amount, 'months');
    this.generateCalendar();
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
        const formattedDate = element.mDate.format('YYYY-MM-DD');
        const dateEvents = [];
        element.events = dateEvents;
        return element;
      });
    });
    this.weeks = dates;
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
}
