import { AnyAction, combineReducers, Reducer } from 'redux';

export interface State {
  wallets: {};
}

const init: Reducer<State> = (state: State, action: AnyAction) => {
  switch (action.type) {
    default:
      return state;
  }
};

export const reducers: Reducer<State> = combineReducers<State>({
  init,
});
