import { AnyAction, Reducer } from 'redux';

export enum ActionTypes {
  DATA = 'RATES_DATA',
}

export interface State {
  [pair: string]: Rate;
}

export type Rate = [
  number, // BID	float	Price of last highest bid
  number, // BID_SIZE	float	Size of the last highest bid
  number, // ASK	float	Price of last lowest ask
  number, // ASK_SIZE	float	Size of the last lowest ask
  number, // DAILY_CHANGE	float	Amount that the last price has changed since yesterday
  number, // DAILY_CHANGE_PERC	float	Amount that the price has changed expressed in percentage terms
  number, // LAST_PRICE	float	Price of the last trade.
  number, // VOLUME	float	Daily volume
  number, // HIGH	float	Daily high
  number // LOW	float	Daily low
];

const rates: Reducer<State> = (state: State = {}, { payload, type }: AnyAction) => {
  switch (type) {
    case ActionTypes.DATA:
      return {
        ...state,
        [payload.pair]: payload.data,
      };

    default:
      return state;
  }
};

export default rates;
