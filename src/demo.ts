import ExchangeState from './index';

const state = new ExchangeState();
state.auth(
  'w7Jd6Vp6cnyzGcc45BgCyje5EDeWFjieOezuKARlvOY',
  'fqoe1P1yrP23cLtsLGKnoLqJ93XGRAE7ZbQWbZFqf0B');

state.subscribeTicker('IOTUSD');
state.start();
