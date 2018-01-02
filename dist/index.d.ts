import { Store as ReduxStore } from 'redux';
import { Store } from './reducers';
export declare function createStore(): ReduxStore<Store>;
declare class ExchangeState {
    private api;
    private store;
    constructor();
    start(): void;
    stop(): void;
    auth(key: string, secret: string): void;
    subscribeTicker(pair: string): void;
}
export default ExchangeState;
