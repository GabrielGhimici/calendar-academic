import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { select } from '@angular-redux/store';
import { Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { isNullOrUndefined } from '../../../utils/is-null-or-undefined';
import { ActivatedRoute, Router } from '@angular/router';

export const CALENDAR_VIEW = {
  MONTH: 'month',
  WEEK: 'week',
  DAY: 'day',
};

@Component({
  selector: 'event-view',
  templateUrl: './event-views.component.html',
  styleUrls: ['./event-views.component.scss']
})
export class EventViewsComponent implements OnInit {
  public currentDate = moment();
  public CALENDAR_VIEW = CALENDAR_VIEW;
  public calendarView = CALENDAR_VIEW.MONTH;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  @select(['router']) readonly router$: Observable<any>;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.router$.pipe(
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
}
