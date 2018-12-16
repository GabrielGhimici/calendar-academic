import { Component } from '@angular/core';
import * as moment from 'moment';
import 'moment/locale/ro';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor () {
    moment.locale('ro');
  }


}
