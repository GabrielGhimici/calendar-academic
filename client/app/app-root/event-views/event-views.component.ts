import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { dispatch, select } from '@angular-redux/store';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { isNullOrUndefined } from '../../../utils/is-null-or-undefined';
import { ActivatedRoute, Router } from '@angular/router';
import { TimeNavigationActions } from './store/time-navigation/time-navigation.actions';
import { EventListActions } from './store/event-list/event-list.actions';
import { getMonthLimits, getWeekLimits } from './store/time-navigation/time-navigation.reducer';
import { CalendarView } from './store/time-navigation/time-navigation';

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
  private isPrivate: boolean = false;

  @select(['router']) readonly router$: Observable<any>;
  @select(['timeNavigation', 'currentDate']) readonly timeNavigation$: Observable<any>;
  @select(['eventList', 'loading']) readonly eventsLoading$: Observable<boolean>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private timeNavActions: TimeNavigationActions,
    private eventListActions: EventListActions
  ) { }

  ngOnInit() {
    this.isPrivate = this.route.snapshot.data.isPrivate;
    this.timeNavigation$.pipe(
      takeUntil(this.ngUnsubscribe),
      filter(data => !isNullOrUndefined(data))
    ).subscribe((data) => {
      this.currentDate = data;
      this.updateInterval();
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
    this.updateInterval();
  }

  @dispatch()
  updateInterval() {
    let start = this.currentDate;
    let end = this.currentDate;
    let interval;
    switch (this.calendarView) {
      case CalendarView.MONTH: {
        interval = getMonthLimits(this.currentDate);
        break;
      }
      case CalendarView.WEEK: {
        interval = getWeekLimits(this.currentDate);
        break;
      }
      case CalendarView.DAY:
      default: {
        interval = null;
      }
    }
    if (!isNullOrUndefined(interval)) {
      start = interval.firstDayOfGrid;
      start.hours(0).minutes(0).seconds(0);
      end = interval.endDayOfGrid;
      end.hours(0).minutes(0).seconds(0);
    }
    return this.eventListActions.updateInterval(start, end, this.isPrivate);
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
