import ExchangeState from './index';

const state = new ExchangeState();
state.auth('your key', 'your secret');
state.subscribeTicker('IOTUSD');
state.start();
