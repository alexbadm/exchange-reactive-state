import * as cors from 'cors';
import * as express from 'express';
import Incremean from 'incremean';
import ExchangeState from './index';

interface Rules { [idx: string]: string[]; }

interface Prices { [pair: string]: [ number, number, boolean ]; }

interface Statistics {
  avg: Incremean;
  max: number;
  min: number;
}

function subsError(e: any) {
  global.console.log('failed to subscribe', e);
}

// const tradingTokens = [
//   'USD',
//   'BTC',
//   'IOT',
//   'ETH',
//   'OMG',
//   'DAT',
//   'DSH',
// ];

// fetch('https://api.bitfinex.com/v1/symbols').then((resp) => resp.json()).then((s) => symbols = s);
const tradingTokensAll = [
  'btc', 'usd', 'ltc', 'eth', 'etc', 'rrt', 'zec', 'xmr', 'dsh', 'eur', 'xrp',
  'iot', 'eos', 'san', 'omg', 'bch', 'neo', 'etp', 'qtm', 'avt', 'edo', 'btg',
  'dat', 'qsh', 'yyw', 'gnt', 'snt', 'bat', 'mna', 'fun', 'zrx', 'tnb', 'spk',
];
const symbols = [
  'btcusd', 'ltcusd', 'ltcbtc', 'ethusd', 'ethbtc', 'etcbtc', 'etcusd',
  'rrtusd', 'rrtbtc', 'zecusd', 'zecbtc', 'xmrusd', 'xmrbtc', 'dshusd',
  'dshbtc', 'btceur', 'xrpusd', 'xrpbtc', 'iotusd', 'iotbtc', 'ioteth',
  'eosusd', 'eosbtc', 'eoseth', 'sanusd', 'sanbtc', 'saneth', 'omgusd',
  'omgbtc', 'omgeth', 'bchusd', 'bchbtc', 'bcheth', 'neousd', 'neobtc',
  'neoeth', 'etpusd', 'etpbtc', 'etpeth', 'qtmusd', 'qtmbtc', 'qtmeth',
  'avtusd', 'avtbtc', 'avteth', 'edousd', 'edobtc', 'edoeth', 'btgusd',
  'btgbtc', 'datusd', 'datbtc', 'dateth', 'qshusd', 'qshbtc', 'qsheth',
  'yywusd', 'yywbtc', 'yyweth', 'gntusd', 'gntbtc', 'gnteth', 'sntusd',
  'sntbtc', 'snteth', 'ioteur', 'batusd', 'batbtc', 'bateth', 'mnausd',
  'mnabtc', 'mnaeth', 'funusd', 'funbtc', 'funeth', 'zrxusd', 'zrxbtc',
  'zrxeth', 'tnbusd', 'tnbbtc', 'tnbeth', 'spkusd', 'spkbtc', 'spketh',
];

const tradingTokens: string[] = tradingTokensAll.map((s) => s.toUpperCase());
const allPairs: string[] = symbols.map((s) => s.toUpperCase());

const pairRules: Rules = allPairs.reduce((result, pair) => {
  const coin = pair.slice(0, 3);
  const currency = pair.slice(3);
  if (result[coin]) {
    result[coin].push(currency);
  } else {
    result[coin] = [currency];
  }
  return result;
}, {} as Rules);

// const pairRules: Rules = {
//   BTC: [ 'USD', 'EUR' ],
//   DAT: [ 'USD', 'BTC', 'ETH' ],
//   DSH: [ 'USD', 'BTC' ],
//   ETH: [ 'USD', 'BTC' ],
//   IOT: [ 'USD', 'BTC', 'ETH', 'EUR' ],
//   OMG: [ 'USD', 'BTC', 'ETH' ],
// };

// const allPairs: string[] = Object.keys(pairRules).reduce((result, cur1) => {
//   pairRules[cur1].forEach((cur2) => {
//     const pair = cur1 + cur2;
//     result.push(pair);
//   });
//   return result;
// }, [] as string[]);

// const pairReverseRules: Rules = {
//   BTC: [ 'DAT', 'DSH', 'ETH', 'IOT', 'OMG' ],
//   ETH: [ 'DAT', 'IOT', 'OMG' ],
//   EUR: [ 'BTC', 'IOT' ],
//   USD: [ 'BTC', 'DAT', 'DSH', 'ETH', 'IOT', 'OMG' ],
// };

const pairReverseRules: Rules = Object.keys(pairRules)
  .reduce((result, coin) => {
    pairRules[coin].forEach((currency) => {
      if (result[currency]) {
        result[currency].push(coin);
      } else {
        result[currency] = [coin];
      }
    });
    return result;
  }, {} as Rules);

// global.console.log('pairRules', pairRules);
// global.console.log('allPairs', allPairs);
// global.console.log('pairReverseRules', pairReverseRules);

// const allReversePairs: string[] = Object.keys(pairReverseRules).reduce((result, cur1) => {
//   pairReverseRules[cur1].forEach((cur2) => {
//     const pair = cur1 + cur2;
//     result.push(pair);
//   });
//   return result;
// }, [] as string[]);

// global.console.log('allPairs', allPairs);
// global.console.log('allReversePairs', allReversePairs);

const state = new ExchangeState();
const API_KEY = process.env.API_KEY || '';
const API_SECRET = process.env.API_SECRET || '';
state.auth(API_KEY, API_SECRET)
.catch((e: any) => global.console.log('auth error', e));
allPairs.forEach((pair) => state.subscribeTicker(pair).catch(subsError));
state.start();

function calculateAllPrices(): Prices {
  const { rates } = state.getState();
  const allPrices: Prices = {};
  allPairs.forEach((pair) => {
    const rPair = pair.slice(3) + pair.slice(0, 3);
    if (rates[pair]) {
      allPrices[pair] = [ rates[pair][0], rates[pair][2], true ];
      allPrices[rPair] = [ 1 / rates[pair][2], 1 / rates[pair][0], false ];
    }
  });
  return allPrices;
}

function calculateChains(limit: number = 0, threshold: number = 0.01) {
  const prices = calculateAllPrices();
  const results: Array<[ number, string, string, string ]> = [];
  tradingTokens.forEach((baseCurrency) => {
    const level1 = pairRules[baseCurrency]
      ? pairRules[baseCurrency].concat(pairReverseRules[baseCurrency])
      : pairReverseRules[baseCurrency];
    // global.console.log('baseCurrency', baseCurrency, 'level1', level1);
    if (!level1) {
      return;
    }

    const baseCurrencySum = 100;

    level1.forEach((step1Currency) => {
      const pair = baseCurrency + step1Currency;
      if (!prices[pair]) {
        return;
      }

      const level2 = pairRules[step1Currency]
        ? pairRules[step1Currency].concat(pairReverseRules[step1Currency])
        : pairReverseRules[step1Currency];

      if (!level2) {
        return;
      }

      const step1Index = baseCurrencySum * prices[pair][0];

      level2.forEach((step2Currency) => {
        const pair2 = step1Currency + step2Currency;
        if (!prices[pair2]) {
          return;
        }

        const step2Index = step1Index * prices[pair2][0];

        const pair3 = step2Currency + baseCurrency;
        if (!prices[pair3]) {
          return;
        }

        const summaryIndex = step2Index * prices[pair3][0];
        const profit = Math.round((summaryIndex / baseCurrencySum - 1) * 10000) / 100;
        results.push([
          profit,
          baseCurrency,
          step1Currency,
          step2Currency,
        ]);
      });
      // global.console.log('price for pair', pair, 'is', prices[pair]);
    });
  });
  const leaders = results
    .filter((res) => res[0] > threshold)
    .sort((a, b) => b[0] - a[0]);

  return (limit === 0 || leaders.length <= limit) ? leaders : leaders.slice(0, limit);
}

const statistics: { [chain: string]: Statistics } = {
  time: {
    avg: new Incremean(),
    max: Number.MIN_SAFE_INTEGER,
    min: Number.MAX_SAFE_INTEGER,
  },
};

function addStatistics(key: string, value: number) {
  if (!statistics[key]) {
    statistics[key] = {
      avg: new Incremean(),
      max: value,
      min: value,
    };
  } else {
    if (value > statistics[key].max) {
      statistics[key].max = value;
    }
    if (value < statistics[key].min) {
      statistics[key].min = value;
    }
  }
  statistics[key].avg.add(value);
}

setInterval(() => {
  const before = Date.now();
  const topChains = calculateChains(6, 0.2);
  const after = Date.now();

  const time = after - before;
  addStatistics('time', time);
  topChains.forEach((res) => addStatistics(`${res[1]}-${res[2]}-${res[3]}-${res[1]}`, res[0]));
}, process.env.INTERVAL || 3000);

const server = express();
// server.use(express.json());
server.use(cors());

server.get('/state', (_, res) => {
  res.json(state.getState()).end();
});

server.get('/statistics', (_, res) => {
  res.json(statistics).end();
});

const port = process.env.PORT || 3000;
server.listen(port, () => global.console.log('server is listening on ' + port));
