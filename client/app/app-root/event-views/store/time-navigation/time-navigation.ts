export interface TimeNavigation {
  operation: Operation;
  amount: number;
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
