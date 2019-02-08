import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash'
import { Observable, Subject } from 'rxjs';
import { dispatch, select } from '@angular-redux/store';
import { filter, takeUntil } from 'rxjs/operators';
import { isNullOrUndefined } from '../../../../utils/is-null-or-undefined';
import { CalendarEvent } from '../../manage-event/store/event';
import { EventDetailsComponent } from '../../event-details/event-details.component';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { EventListActions } from '../store/event-list/event-list.actions';

@Component({
  selector: 'day-view',
  templateUrl: './day-view.component.html',
  styleUrls: ['./day-view.component.scss']
})
export class DayViewComponent implements OnInit {
  public day = moment();
  public hours: any[] = [];
  public hourLabels: string[] = [];
  public recurrenceDays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  private events: Array<CalendarEvent> = [];
  public shownEvents: Array<CalendarEvent> = [];
  private cellHeight: number = 32;
  private isPrivate: boolean = false;

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  @select(['timeNavigation', 'currentDate']) readonly timeNavigation$: Observable<any>;
  @select(['eventList', 'events']) readonly events$: Observable<any>;

  @ViewChild('gridColumn') gridColumn;
  private columnWidth: number = 0;

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private eventListActions: EventListActions
  ) { }

  ngOnInit() {
    this.isPrivate = this.route.snapshot.data.isPrivate;
    this.timeNavigation$.pipe(
      takeUntil(this.ngUnsubscribe),
      filter(data => !isNullOrUndefined(data))
    ).subscribe((data) => {
      this.day = data;
      this.generateDay();
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
      this.generateDay();
    });
  }

  ngAfterViewInit() {
    this.columnWidth = this.gridColumn.nativeElement.clientWidth;
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  isToday(date: moment.Moment): boolean {
    return moment().isSame(moment(date), 'day');
  }

  generateDay() {
    this.day.hours(0).minutes(0).seconds(0).milliseconds(0);
    this.hourLabels = _.range(1, 25).map(hour => this.formatHour(hour));
    this.hours = _.range(0, 24);
    this.shownEvents = this.enrichEvents(this.events.filter((event: CalendarEvent) => {
      event.startDate.hours(0).minutes(0).seconds(0).milliseconds(0);
      event.endDate.hours(0).minutes(0).seconds(0).milliseconds(0);
      if (!event.recurrent) {
        return this.day.isBetween(event.startDate, event.endDate, null, '[]');
      } else {
        const dayInRange = this.day.isBetween(event.startDate, event.endDate, null, '[]');
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
          accumulator = accumulator || this.day.isSame(day);
          return accumulator;
        }, false);
        return dayInRange && isDayOfRecurrence;
      }
    }));
  }

  formatHour(value) {
    if (value < 10) {
      return `0${value}:00`;
    } else {
      return `${value}:00`;
    }
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
    const hourValue = isNaN(Number(timeElements[0])) ? 1 : Number(timeElements[0]);
    const minValue = (Number(timeElements[1]) || 0) / 60;
    return hourValue + minValue;
  }

  openModal(events: Array<CalendarEvent>) {
    const detailsModal = this.dialog.open(EventDetailsComponent, {
      width: '600px',
      height: "500px",
      disableClose: true,
      autoFocus: false,
      data: events
    });
    detailsModal.afterClosed().pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe((closedData) => {
      if (closedData) this.updateInterval();
    })
  }

  @dispatch()
  updateInterval() {
    let start = moment(this.day);
    let end = moment(this.day);
    start.hours(0).minutes(0).seconds(0);
    end.hours(0).minutes(0).seconds(0);
    return this.eventListActions.updateInterval(start, end, this.isPrivate);
  }
}
