import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import * as _ from 'lodash';
import { CalendarEvent, getHour } from './store/event';
import * as moment from 'moment';
import { dispatch } from '@angular-redux/store';
import { EventActions } from './store/event.actions';

function generateHourLabels() {
  return _.range(0, 24).reduce((accumulator, element) => {
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
  public event: CalendarEvent = new CalendarEvent();
  public isEdit: boolean = false;
  public allDay: boolean = false;
  public hourLabels: string[] = generateHourLabels();
  public frequency: number[] = _.range(1,6);
  private previousStartHour = null;
  private previousEndHour = null;
  private previousEndDate = null;
  private ngUnsubscribe:Subject<void> = new Subject<void>();
  constructor(
    private eventActions: EventActions
  ) { }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit() {}

  @dispatch()
  saveEvent() {
    return this.eventActions.saveStart(this.event);
  }

  toggleDay(day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday') {
    const dayIndex = this.event.recurringDays.indexOf(day);
    if(dayIndex === -1) {
      this.event.recurringDays.push(day);
    } else if(this.event.recurringDays.length > 1) {
      this.event.recurringDays.splice(dayIndex, 1);
    }
  }

  toggleAllDay() {
    if (this.allDay) {
      this.previousStartHour = this.event.startHour;
      this.previousEndHour = this.event.endHour;
      this.event.startHour = '00:00';
      this.event.endHour = '00:00';
    } else {
      if (this.previousStartHour) {
        this.event.startHour = this.previousStartHour;
      } else {
        this.event.startHour = getHour();
      }
      if (this.previousEndHour) {
        this.event.endHour = this.previousEndHour;
      } else {
        this.event.endHour = getHour(true);
      }
      if (this.previousEndDate) {
        this.event.endDate = this.previousEndDate;
      } else {
        this.event.endDate = moment();
      }
    }
  }

  generateRecurrentInformation() {
    let info = 'Se repetă';
    if (this.event.frequency === 1) {
      info = `${info} în fiecare`
    } else {
      info = `${info} la fiecare ${this.event.frequency} săptămâni,`
    }
    info = `${info} ${this.processRecurrenceDays()}`;
    info = `${info} de la data de ${this.event.startDate.format('DD MMMM YYYY')}`;
    info = `${info} până la data de ${this.event.endDate.format('DD MMMM YYYY')}`;
    if (!this.allDay) {
      info = `${info} între orele ${this.event.startHour} și ${this.event.endHour}`;
    }
    return info;
  }

  private processRecurrenceDays() {
    let brokenDays = [];
    this.event.recurringDays.indexOf('monday') >= 0 ? brokenDays.push(`Luni`): 0;
    this.event.recurringDays.indexOf('tuesday') >= 0 ? brokenDays.push(`Marti`): 0;
    this.event.recurringDays.indexOf('wednesday') >= 0 ? brokenDays.push(`Miercuri`): 0;
    this.event.recurringDays.indexOf('thursday') >= 0 ? brokenDays.push(`Joi`): 0;
    this.event.recurringDays.indexOf('friday') >= 0 ? brokenDays.push(`Vineri`): 0;
    this.event.recurringDays.indexOf('saturday') >= 0 ? brokenDays.push(`Sâmbătă`): 0;
    this.event.recurringDays.indexOf('sunday') >= 0 ? brokenDays.push(`Duminică`): 0;
    if (brokenDays.length > 1) {
      const lastDay = brokenDays[brokenDays.length - 1];
      brokenDays.splice(brokenDays.length - 1, 1);
      return `${brokenDays.join(', ')} și ${lastDay}`;
    } else {
      return `${brokenDays[0]}`;
    }
  }

}
