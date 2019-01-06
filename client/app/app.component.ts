import { Component } from '@angular/core';
import * as moment from 'moment';
import 'moment/locale/ro';
import { Observable, Subject } from 'rxjs';
import { select } from '@angular-redux/store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @select(['currentEvent']) readonly currentEvent$: Observable<any>;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  constructor () {
    moment.locale('ro');
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
