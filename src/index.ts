import { createStore, Store } from 'redux';
import { reducers, State } from './reducers';

export function createState(): Store<State> {
  return createStore(reducers);
}
