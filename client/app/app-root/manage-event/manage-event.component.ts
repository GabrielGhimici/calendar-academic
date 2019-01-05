import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import * as _ from 'lodash';

function generateHourLabels() {
  return _.range(0, 23).reduce((accumulator, element) => {
    if (element < 10) {
      accumulator.push(`0${element}:00`);
      accumulator.push(`0${element}:15`);
      accumulator.push(`0${element}:30`);
      accumulator.push(`0${element}:45`);
    } else {
      accumulator.push(`${element}:00`);
      accumulator.push(`${element}:15`);
      accumulator.push(`${element}:30`);
      accumulator.push(`${element}:45`);
    }
    return accumulator;
  }, []);
}

@Component({
  selector: 'manage-event',
  templateUrl: './manage-event.component.html',
  styleUrls: ['./manage-event.component.scss']
})
export class ManageEventComponent implements OnInit {
  public isEdit: boolean = false;
  public hourLabels: string[] = generateHourLabels();
  private ngUnsubscribe:Subject<void> = new Subject<void>();
  constructor() { }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit() {

  }

}
