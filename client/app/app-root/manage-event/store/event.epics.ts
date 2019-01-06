import { Injectable } from '@angular/core';
import { combineEpics, ofType } from 'redux-observable';
import { catchError, map, switchMap } from 'rxjs/operators';
import { EventActions } from './event.actions';
import { PayloadAction } from '../../../store/payload-action';
import { ManageEventService } from '../manage-event.service';
import { of } from 'rxjs';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';

@Injectable()
export class EventEpics {
  constructor(
    private eventActions: EventActions,
    private manageEventService: ManageEventService,
    private matSnackBar: MatSnackBar,
    private router: Router
  ) {};

  public createEpics() {
    return combineEpics(
      this.saveEvent()
    );
  }

  private saveEvent() {
    return action$ => action$.pipe(
      ofType(EventActions.EVENT_SAVE_START),
      switchMap((action: PayloadAction) => {
        return this.manageEventService.saveEvent(action.payload).pipe(
          map((_) => {
            this.matSnackBar.open(
              'Evenimentul a fost salvat cu succes!',
              '',
              {
                duration: 2000,
                horizontalPosition: 'right',
              }
            );
            this.router.navigate(['./event']);
            return this.eventActions.saveSucceed()
          }),
          catchError(err => {
            this.matSnackBar.open(
              'Evenimetul nu a putut fi salvat',
              '',
              {
                duration: 2000,
                horizontalPosition: 'right',
              }
            );
            return of(this.eventActions.saveFailed(err))
          })
        );
      })
    );
  }
}
