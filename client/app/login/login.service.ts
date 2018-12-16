import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppState } from 'client/app/store/app-state';
import { NgRedux } from '@angular-redux/store';
import {map} from 'rxjs/operators';

@Injectable()
export class LoginService {

  constructor(private http: HttpClient,
              private store: NgRedux<AppState>) { }

  public logIn(bodyValue: string) {
    return this.http.post('api/user/login', {bodyValue});
  }

  public logOut() {
    return this.http.post('api/user/logout', {});
  }

  get isLoggedIn() {
    return this.store.select(['loginData', 'loggedIn']).pipe(map((_: boolean) => {
      return _ === true;
    }));
  }
}
