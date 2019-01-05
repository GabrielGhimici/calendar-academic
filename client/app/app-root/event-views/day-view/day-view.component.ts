import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash'
import { Observable, Subject } from 'rxjs';
import { select } from '@angular-redux/store';
import { filter, takeUntil } from 'rxjs/operators';
import { isNullOrUndefined } from '../../../../utils/is-null-or-undefined';
import { Operation } from '../store/time-navigation/time-navigation';

@Component({
  selector: 'day-view',
  templateUrl: './day-view.component.html',
  styleUrls: ['./day-view.component.scss']
})
export class DayViewComponent implements OnInit {
  public day = moment();
  public hours: any[] = [];
  public hourLabels: string[] = [];

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  @select(['timeNavigation']) readonly timeNavigation$: Observable<any>;

  constructor() { }

  ngOnInit() {
    this.generateDay();
    this.timeNavigation$.pipe(
      takeUntil(this.ngUnsubscribe),
      filter(data => !isNullOrUndefined(data.operation))
    ).subscribe((data) => {
      if (data.amount > 0) {
        if (data.operation === Operation.Add) {
          this.nextDay(data.amount);
        }
        if (data.operation === Operation.Subtract) {
          this.prevDay(data.amount);
        }
      }
    })
  }

  isToday(date: moment.Moment): boolean {
    return moment().isSame(moment(date), 'day');
  }

  prevDay(differentAmount?: number): void {
    const amount = differentAmount || 1;
    this.day = moment(this.day).subtract(amount, 'days');
    this.generateDay();
  }

  nextDay(differentAmount?: number): void {
    const amount = differentAmount || 1;
    this.day = moment(this.day).add(amount, 'days');
    this.generateDay();
  }

  generateDay() {
    this.hourLabels = _.range(1, 25).map(hour => this.formatHour(hour));
    this.hours = _.range(0, 24);
  }

  formatHour(value) {
    if (value < 10) {
      return `0${value}:00`;
    } else {
      return `${value}:00`;
    }
  }
}
