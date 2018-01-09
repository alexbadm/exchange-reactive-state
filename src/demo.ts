import * as express from 'express';
import ExchangeState from './index';

const port = process.env.PORT || 3000;

function subsError(e: any) {
  global.console.log('failed to subscribe', e);
}

const symbols = [
  'BTCUSD', 'LTCUSD', 'LTCBTC', 'ETHUSD', 'ETHBTC', 'ETCBTC', 'ETCUSD',
  'RRTUSD', 'RRTBTC', 'ZECUSD', 'ZECBTC', 'XMRUSD', 'XMRBTC', 'DSHUSD',
  'DSHBTC', 'BTCEUR', 'XRPUSD', 'XRPBTC', 'IOTUSD', 'IOTBTC', 'IOTETH',
  'EOSUSD', 'EOSBTC', 'EOSETH', 'SANUSD', 'SANBTC', 'SANETH', 'OMGUSD',
  'OMGBTC', 'OMGETH', 'BCHUSD', 'BCHBTC', 'BCHETH', 'NEOUSD', 'NEOBTC',
  'NEOETH', 'ETPUSD', 'ETPBTC', 'ETPETH', 'QTMUSD', 'QTMBTC', 'QTMETH',
  'AVTUSD', 'AVTBTC', 'AVTETH', 'EDOUSD', 'EDOBTC', 'EDOETH', 'BTGUSD',
  'BTGBTC', 'DATUSD', 'DATBTC', 'DATETH', 'QSHUSD', 'QSHBTC', 'QSHETH',
  'YYWUSD', 'YYWBTC', 'YYWETH', 'GNTUSD', 'GNTBTC', 'GNTETH', 'SNTUSD',
  'SNTBTC', 'SNTETH', 'IOTEUR', 'BATUSD', 'BATBTC', 'BATETH', 'MNAUSD',
  'MNABTC', 'MNAETH', 'FUNUSD', 'FUNBTC', 'FUNETH', 'ZRXUSD', 'ZRXBTC',
  'ZRXETH', 'TNBUSD', 'TNBBTC', 'TNBETH', 'SPKUSD', 'SPKBTC', 'SPKETH',
];

const onlyCoins = [ 'BTC', 'IOT', 'USD', 'ETH', 'DSH' ];

const allPairs: string[] = symbols.filter((s) => ~onlyCoins.indexOf(s.slice(0, 3)) && ~onlyCoins.indexOf(s.slice(3)));

const state = new ExchangeState();
const API_KEY = process.env.API_KEY || '';
const API_SECRET = process.env.API_SECRET || '';

state.auth(API_KEY, API_SECRET)
.catch((e: any) => global.console.log('auth error', e));
allPairs.forEach((pair) => state.subscribeTicker(pair).catch(subsError));
state.start();

const server = express();
server.use((_, res) => res.json(state.getState()));
server.listen(port, () => global.console.log('server is listening on ' + port));
