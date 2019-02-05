import { Injectable } from '@angular/core';
import { LoginEpics } from '../login/store/login.epic';
import { EventEpics } from '../app-root/manage-event/store/event.epics';
import { EventListEpics } from '../app-root/event-views/store/event-list/event-list.epics';

@Injectable()
export class RootEpics {
  constructor(
    private loginEpic: LoginEpics,
    private eventEpic: EventEpics,
    private eventListEpics: EventListEpics
  ) {}

  public createEpics() {
    return [
      this.loginEpic.createEpic(),
      this.eventEpic.createEpics(),
      this.eventListEpics.createEpics()
    ];
  }
}
