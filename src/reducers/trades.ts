import { AnyAction, Reducer } from 'redux';

export enum ActionTypes {
  te = 'TRADES_TRADE_EXECUTED',
  tu = 'TRADES_TRADE_EXECUTION_UPDATE',
}

export type Trade = [
  number, // ID	integer	Trade database id
  string, // PAIR	string	Pair (BTCUSD, …)
  number, // MTS_CREATE	integer	Execution timestamp
  number, // ORDER_ID	integer	Order id
  number, // EXEC_AMOUNT	float	Positive means buy, negative means sell
  number, // EXEC_PRICE	float	Execution price
  string, // ORDER_TYPE	string	Order type
  number, // ORDER_PRICE	float	Order price
  number, // MAKER	int	1 if true, 0 if false
  number, // FEE	float	Fee
  string  // FEE_CURRENCY	string	Fee currency
];

export type State = Trade[];

// export interface TradeAction extends AnyAction {
//   type: 'te' | 'tu';
//   payload: Trade | Trade[];
// }

const trades: Reducer<State> = (state: State = [], { payload, type }: AnyAction) => {
  switch (type) {
    case ActionTypes.te:
      return state.concat([ payload ]);

    case ActionTypes.tu:
      return state
        .filter((trade) => trade[0] !== payload[0])
        .concat([ payload ]);

    default:
      return state;
  }
};

export default trades;
