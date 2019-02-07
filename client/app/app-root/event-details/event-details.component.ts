import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { dispatch, select } from '@angular-redux/store';
import { EventListActions } from '../event-views/store/event-list/event-list.actions';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss']
})
export class EventDetailsComponent implements OnInit {
  private acceptations: number = 0;
  private acceptedEventIndex: number = -1;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  @select(['eventList', 'accepting']) readonly accepting$: Observable<any>;
  @select(['eventList', 'accepted']) readonly accepted$: Observable<any>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private eventListActions: EventListActions
    ) { }

  ngOnInit() {
    this.resetAccepted();
    this.accepted$.pipe(
      takeUntil(this.ngUnsubscribe),
      filter(data => data === true)
    ).subscribe((data) => {
      console.log(data);
      this.acceptations++;
      if (this.acceptedEventIndex >= 0) {
        this.data[this.acceptedEventIndex].isInvitation = false;
        this.acceptedEventIndex = -1;
      }
    })
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  acceptEvent(event, index) {
    this.acceptedEventIndex = index;
    this.accept(event.invitationId);
  }

  @dispatch()
  accept(id: any) {
    return this.eventListActions.acceptInvitation(id);
  }

  @dispatch()
  resetAccepted() {
    return this.eventListActions.resetAccepted();
  }
}
