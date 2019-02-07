import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { dispatch, select } from '@angular-redux/store';
import { ProfileActions } from '../store/profile/profile.actions';
import { Observable, Subject } from 'rxjs';
import { Profile } from '../store/profile/profile';
import { filter, takeUntil } from 'rxjs/operators';
import { isNullOrUndefined } from '../../utils/is-null-or-undefined';

@Component({
  selector: 'app-root',
  templateUrl: './app-root.component.html',
  styleUrls: ['./app-root.component.scss']
})
export class AppRootComponent implements OnInit {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private profile: Profile = null;
  @select(['profile', 'data']) readonly profile$: Observable<any>;

  constructor(
    private http: HttpClient,
    private router: Router,
    private profileActions: ProfileActions
  ) { }

  ngOnInit() {
    this.loadProfile();
    this.profile$.pipe(
      takeUntil(this.ngUnsubscribe),
      filter(data => !isNullOrUndefined(data))
    ).subscribe(data => {
      this.profile = data;
    })
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  @dispatch()
  loadProfile() {
    return this.profileActions.loadProfile();
  }

  logOutUser() {
    this.http.post('/api/user/logout', {}).subscribe((_) => {
      document.cookie = 'CAToken = ""';
      this.router.navigate(['./login']);
    })
  }
}
