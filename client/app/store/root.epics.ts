import { Injectable } from '@angular/core';
import { LoginEpics } from './login/login.epic';

@Injectable()
export class RootEpics {
  constructor(
    private loginEpic: LoginEpics
  ) {}

  public createEpics() {
    return [
      this.loginEpic.createEpic(),
    ];
  }
}
