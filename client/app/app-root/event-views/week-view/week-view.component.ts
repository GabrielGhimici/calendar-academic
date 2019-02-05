import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Observable, Subject } from 'rxjs';
import { select } from '@angular-redux/store';
import { filter, takeUntil } from 'rxjs/operators';
import { isNullOrUndefined } from '../../../../utils/is-null-or-undefined';
import { CalendarEvent } from '../../manage-event/store/event';


export interface CalendarDate {
  startMoment: moment.Moment;
  endMoment: moment.Moment;
  today?: boolean;
}

@Component({
  selector: 'week-view',
  templateUrl: './week-view.component.html',
  styleUrls: ['./week-view.component.scss']
})
export class WeekViewComponent implements OnInit {
  public days: any[] = [];
  public hours: any[] = [];
  private dayNames = ['Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă', 'Duminică'];
  public recurrenceDays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  public hourLabels: string[] = [];
  public currentDate = moment();
  private events: Array<CalendarEvent> = [];
  private cellHeight: number = 32;

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  @select(['timeNavigation', 'currentDate']) readonly timeNavigation$: Observable<any>;
  @select(['eventList', 'events']) readonly events$: Observable<any>;

  @ViewChild('gridColumn') gridColumn;
  private columnWidth: number = 0;

  constructor() { }

  ngOnInit() {
    this.timeNavigation$.pipe(
      takeUntil(this.ngUnsubscribe),
      filter(data => !isNullOrUndefined(data))
    ).subscribe((data) => {
      this.currentDate = data;
      this.generateWeek();
    });
    this.events$.pipe(
      takeUntil(this.ngUnsubscribe),
      filter(data =>  !isNullOrUndefined(data))
    ).subscribe((data) => {
      this.events = data.map(event => {
        event.additionalInfo = {};
        event.additionalInfo.colorClass = `color-${this.getRandomIntInclusive(1,12) * 10}`;
        return event;
      });
      console.log(this.events);
      this.generateWeek();
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngAfterViewInit() {
    this.columnWidth = this.gridColumn.nativeElement.clientWidth;
  }

  private getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  isToday(date: moment.Moment): boolean {
    return moment().isSame(moment(date), 'day');
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

  generateWeek() {
    const weekDates = this.fillDates(this.currentDate);
    this.hourLabels = _.range(1, 25).map(hour => this.formatHour(hour));
    this.hours = _.range(0, 24);
    this.days = weekDates.map((item: CalendarDate, index: number) => {
      console.log(item.startMoment.format());
      const dayEvents = this.events.filter((event: CalendarEvent) => {
        if (!event.recurrent) {
          return item.startMoment.isBetween(event.startDate, event.endDate, null, '[]');
        } else {
          const dayInRange = item.startMoment.isBetween(event.startDate, event.endDate, null, '[]');
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
            accumulator = accumulator || item.startMoment.isSame(day);
            return accumulator;
          }, false);
          return dayInRange && isDayOfRecurrence;
        }
      });
      return {
        dayDate: item.startMoment,
        label: `${this.dayNames[index]}, ${item.startMoment.format('DD MMM')}`,
        today: item.today,
        events: this.enrichEvents(dayEvents)
      };
    });
    console.log(this.days);
  }

  enrichEvents(eventList: Array<CalendarEvent>) {
    return eventList.map((event: any, index: number) => {
      const newEvent = _.cloneDeep(event);
      const approxWidth = Math.trunc(this.columnWidth / eventList.length);
      newEvent.additionalInfo.top = this.parseTime(event.startHour) * this.cellHeight;
      newEvent.additionalInfo.height = (this.parseTime(event.endHour) * this.cellHeight) - newEvent.additionalInfo.top;
      newEvent.additionalInfo.width = approxWidth;
      newEvent.additionalInfo.left = index * approxWidth;
      return newEvent;
    });
  }

  parseTime(time: string) {
    const timeElements = time.split(':');
    const hourValue = Number(timeElements[0]) || 1;
    const minValue = (Number(timeElements[1]) || 0) / 60;
    return hourValue + minValue;
  }

  formatHour(value) {
    if (value < 10) {
      return `0${value}:00`;
    } else {
      return `${value}:00`;
    }
  }

  fillDates(currentMoment: moment.Moment): CalendarDate[] {
    const firstDayOfGrid = moment(currentMoment).startOf('week');
    const start = firstDayOfGrid.date();
    return _.range(start, start + 7)
      .map((date: number): CalendarDate => {
        const d = moment(firstDayOfGrid).date(date);
        return {
          today: this.isToday(d),
          startMoment: d,
          endMoment: d
        };
      });
  }

}
