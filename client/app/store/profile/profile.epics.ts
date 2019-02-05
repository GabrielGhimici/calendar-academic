import { Injectable } from '@angular/core';
import { combineEpics, ofType } from 'redux-observable';
import { ProfileActions } from './profile.actions';
import { catchError, map, switchMap } from 'rxjs/operators';
import { PayloadAction } from '../payload-action';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { Profile } from './profile';

@Injectable()
export class ProfileEpics {
  constructor(
    private profileActions: ProfileActions,
    private http: HttpClient
  ) {}

  public createEpics() {
    return combineEpics(
      this.loadProfile()
    );
  }

  private loadProfile() {
    return (action$) => action$.pipe(
      ofType(ProfileActions.PROFILE_LOAD_START),
      switchMap((action: PayloadAction) => {
        return this.http.get('/api/user/details').pipe(
          map((data) => {
            const user = Object.assign({}, new Profile(), data);
            return this.profileActions.loadProfileSucceeded(user);
          }),
          catchError(error => of(this.profileActions.loadProfileFailed(error)))
        );
      })
    )
  }
}
