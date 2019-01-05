import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { dispatch, select } from '@angular-redux/store';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { isNullOrUndefined } from '../../../utils/is-null-or-undefined';
import { ActivatedRoute, Router } from '@angular/router';
import { TimeNavigationActions } from './store/time-navigation/time-navigation.actions';


export enum CalendarView {
  MONTH ='month',
  WEEK = 'week',
  DAY ='day',
};

@Component({
  selector: 'event-view',
  templateUrl: './event-views.component.html',
  styleUrls: ['./event-views.component.scss']
})
export class EventViewsComponent implements OnInit {
  public currentDate = moment();
  public CALENDAR_VIEW = CalendarView;
  public calendarView: any = CalendarView.MONTH;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  @select(['router']) readonly router$: Observable<any>;
  @select(['timeNavigation', 'currentDate']) readonly timeNavigation$: Observable<any>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private timeNavActions: TimeNavigationActions
  ) { }

  ngOnInit() {
    this.timeNavigation$.pipe(
      takeUntil(this.ngUnsubscribe),
      filter(data => !isNullOrUndefined(data))
    ).subscribe((data) => {
      this.currentDate = data;
    });
    this.router$.pipe(
      takeUntil(this.ngUnsubscribe),
      filter(route => !isNullOrUndefined(route))
    ).subscribe((route) => {
      this.getSelectedView(route);
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private getSelectedView(route: string) {
    if (route &&
        route.split('/').length &&
        route.split('/')[3] &&
        route.split('/')[3] !== this.calendarView) {
      this.calendarView = route.split('/')[3];
    }
  }

  onViewChange(view: string) {
    this.router.navigate([`./${view}`], {relativeTo: this.route});
  }

  @dispatch()
  nextTimeUnit() {
    return this.timeNavActions.add(1, this.calendarView);
  }

  @dispatch()
  previousTimeUnit() {
    return this.timeNavActions.subtract(1, this.calendarView);
  }
}
