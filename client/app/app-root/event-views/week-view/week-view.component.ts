import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Observable, Subject } from 'rxjs';
import { select } from '@angular-redux/store';
import { filter, takeUntil } from 'rxjs/operators';
import { isNullOrUndefined } from '../../../../utils/is-null-or-undefined';
import { Operation } from '../store/time-navigation/time-navigation';


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
  public hourLabels: string[] = [];
  public currentDate = moment();

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  @select(['timeNavigation', 'currentDate']) readonly timeNavigation$: Observable<any>;

  constructor() { }

  ngOnInit() {
    this.timeNavigation$.pipe(
      takeUntil(this.ngUnsubscribe),
      filter(data => !isNullOrUndefined(data))
    ).subscribe((data) => {
      this.currentDate = data;
      this.generateWeek();
    })
  }

  ngOnChanges(changes) {
    if (changes.events && changes.events.currentValue) {
      this.generateWeek();
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }


  isToday(date: moment.Moment): boolean {
    return moment().isSame(moment(date), 'day');
  }

  generateWeek() {
    const weekDates = this.fillDates(this.currentDate);
    this.hourLabels = _.range(1, 25).map(hour => this.formatHour(hour));
    this.hours = _.range(0, 24);
    this.days = weekDates.map((item: CalendarDate, index: number) => {
      return {
        dayDate: item.startMoment,
        label: `${this.dayNames[index]}, ${item.startMoment.format('DD MMM')}`,
        today: item.today
      };
    });
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
