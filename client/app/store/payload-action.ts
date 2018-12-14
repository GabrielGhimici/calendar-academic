import { Action } from 'redux';

export interface PayloadAction<P, M> extends Action {
  payload?: P;
  error?: any;
  meta?: M;
}
