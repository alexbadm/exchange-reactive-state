import BfxApi from 'bfx-api';
import { SubscribeEvent } from 'bfx-api/dist/BfxApi';
import { Store as ReduxStore } from 'redux';
import { Store } from './reducers';
export declare function createStore(): ReduxStore<Store>;
declare class ExchangeState {
    api: BfxApi;
    private store;
    constructor();
    getState(): Store;
    start(): void;
    stop(): void;
    auth(key: string, secret: string): Promise<{}>;
    subscribeTicker(pair: string): Promise<SubscribeEvent>;
}
export default ExchangeState;
