import { AnyAction, Reducer } from 'redux';

export enum ActionTypes {
  os = 'ORDERS_SNAPSHOT',
  on = 'ORDERS_NEW',
  ou = 'ORDERS_UPDATE',
  oc = 'ORDERS_CANCEL',
}

export type Order = [
  number, // ID	int	Order ID
  number, // GID	int	Group ID
  number, // CID	int	Client Order ID
  string, // SYMBOL	string	Pair (tBTCUSD, …)
  number, // MTS_CREATE	int	Millisecond timestamp of creation
  number, // MTS_UPDATE	int	Millisecond timestamp of update
  number, // AMOUNT	float	Positive means buy, negative means sell.
  number, // AMOUNT_ORIG	float	Original amount
  string, // TYPE	string	The type of the order:
    // LIMIT, MARKET, STOP, TRAILING STOP, EXCHANGE MARKET, EXCHANGE LIMIT,
    // EXCHANGE STOP, EXCHANGE TRAILING STOP, FOK, EXCHANGE FOK.
  string, // TYPE_PREV	string	Previous order type
  number, // FLAGS	int	Upcoming Params Object (stay tuned)
  string, // ORDER_STATUS	string	Order Status: ACTIVE, EXECUTED, PARTIALLY FILLED, CANCELED
  number, // PRICE	float	Price
  number, // PRICE_AVG	float	Average price
  number, // PRICE_TRAILING	float	The trailing price
  number, // PRICE_AUX_LIMIT	float	Auxiliary Limit price (for STOP LIMIT)
  number, // NOTIFY	int	1 if Notify flag is active, 0 if not
  number, // HIDDEN	int	1 if Hidden, 0 if not hidden
  number  // PLACED_ID	int	If another order caused this order to be placed (OCO) this will be that other order's ID
];

export interface State {
  active: Order[];
  canceled: Order[];
}

// export interface OrderAction extends AnyAction {
//   type: 'te' | 'tu';
//   payload: Order | Order[];
// }

const defaultState = {
  active: [],
  canceled: [],
};

const orders: Reducer<State> = (state: State = defaultState, { payload, type }: AnyAction) => {
  switch (type) {
    case ActionTypes.os:
      return {
        ...state,
        active: payload,
      };

    case ActionTypes.on:
      return {
        ...state,
        active: state.active.concat([ payload ]),
      };

    case ActionTypes.ou:
      return {
        ...state,
        active: state.active
          .filter((order) => order[0] !== payload[0])
          .concat([ payload ]),
      };

    case ActionTypes.oc:
      return {
        ...state,
        active: state.active.filter((order) => order[0] !== payload[0]),
        canceled: state.canceled.concat([ payload ]),
      };

    default:
      return state;
  }
};

export default orders;
