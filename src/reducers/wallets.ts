import { AnyAction, Reducer } from 'redux';

export enum ActionTypes {
  ws = 'WALLETS_STATE',
  wu = 'WALLETS_UPDATE',
}

export type CurrencyBalance = [
  string, // WALLET_TYPE	string	Wallet name (exchange, margin, funding)
  string, // CURRENCY	string	Currency (fUSD, etc)
  number, // BALANCE	float	Wallet balance
  number, // UNSETTLED_INTEREST	float	Unsettled interest
  number | null // BALANCE_AVAILABLE	float / null	Amount not tied up in active orders,
  // positions or funding (null if the value is not fresh enough).
];

export type State = CurrencyBalance[];

// export interface WalletAction extends AnyAction {
//   type: 'ws' | 'wu';
//   payload: CurrencyBalance | CurrencyBalance[];
// }

const wallets: Reducer<State> = (state: State = [], { payload, type }: AnyAction) => {
  switch (type) {
    case ActionTypes.ws:
      return payload;

    case ActionTypes.wu:
      return state
        .filter((bal) => bal[0] !== payload[0] && bal[1] !== payload[1])
        .concat(payload);

    default:
      return state;
  }
};

export default wallets;
