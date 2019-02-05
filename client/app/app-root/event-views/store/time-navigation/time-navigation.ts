export interface TimeNavigation {
  currentDate: any;
  periodStart: any;
  periodEnd: any;
}

export enum TimeUnit {
  Months = 'months',
  Weeks = 'weeks',
  Days = 'days',
}

export enum Operation {
  Add = 'add',
  Subtract = 'subtract'
}

export enum CalendarView {
  MONTH ='month',
  WEEK = 'week',
  DAY ='day',
};
