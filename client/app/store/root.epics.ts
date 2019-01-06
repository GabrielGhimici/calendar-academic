import { Injectable } from '@angular/core';
import { LoginEpics } from '../login/store/login.epic';
import { EventEpics } from '../app-root/manage-event/store/event.epics';

@Injectable()
export class RootEpics {
  constructor(
    private loginEpic: LoginEpics,
    private eventEpic: EventEpics
  ) {}

  public createEpics() {
    return [
      this.loginEpic.createEpic(),
      this.eventEpic.createEpics(),
    ];
  }
}
