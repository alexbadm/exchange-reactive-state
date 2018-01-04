import * as cors from 'cors';
import * as express from 'express';
import Incremean from 'incremean';
import ExchangeState from './index';

function subsError(e: any) {
  global.console.log('failed to subscribe', e);
}

const tradingTokens = [
  'USD',
  'BTC',
  'IOT',
  'ETH',
  'OMG',
  'DAT',
  'DSH',
];

interface Rules { [idx: string]: string[]; }

const pairRules: Rules = {
  BTC: [ 'USD', 'EUR' ],
  DAT: [ 'USD', 'BTC', 'ETH' ],
  DSH: [ 'USD', 'BTC' ],
  ETH: [ 'USD', 'BTC' ],
  IOT: [ 'USD', 'BTC', 'ETH', 'EUR' ],
  OMG: [ 'USD', 'BTC', 'ETH' ],
};

const allPairs: string[] = Object.keys(pairRules).reduce((result, cur1) => {
  pairRules[cur1].forEach((cur2) => {
    const pair = cur1 + cur2;
    result.push(pair);
  });
  return result;
}, [] as string[]);

const pairReverseRules: Rules = {
  BTC: [ 'DAT', 'DSH', 'ETH', 'IOT', 'OMG' ],
  ETH: [ 'DAT', 'IOT', 'OMG' ],
  EUR: [ 'BTC', 'IOT' ],
  USD: [ 'BTC', 'DAT', 'DSH', 'ETH', 'IOT', 'OMG' ],
};

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
state.auth('your key', 'your secret')
.catch((e: any) => global.console.log('auth error', e));
allPairs.forEach((pair) => state.subscribeTicker(pair).catch(subsError));
state.start();

interface Prices { [pair: string]: [ number, number, boolean ]; }

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

function calculateChains() {
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

      const step1Index = baseCurrencySum * prices[pair][0]; // TODO: which price to take?

      level2.forEach((step2Currency) => {
        const pair2 = step1Currency + step2Currency;
        if (!prices[pair2]) {
          return;
        }

        const step2Index = step1Index * prices[pair2][0]; // TODO: which price to take?

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
    .filter((res) => res[0] > 0.01)
    .sort((a, b) => b[0] - a[0]);

  return leaders.length < 4 ? leaders : [ leaders[0], leaders[1], leaders[3] ];

  // const top1 = top3[0];
  // const relatedPrices = Object.keys(prices)
  //   .filter((pair) =>
  //     (~pair.indexOf(top1[1]) && ~pair.indexOf(top1[2]))
  //       || (~pair.indexOf(top1[1]) && ~pair.indexOf(top1[3]))
  //       || (~pair.indexOf(top1[2]) && ~pair.indexOf(top1[3])))
  //   .map((pair) => pair + ' ' + prices[pair]);
  // global.console.log(`\n${top1[1]}-${top1[2]}-${top1[3]}-${top1[1]}   +${top1[0]}%\n${relatedPrices.join('\n')}`);
}

interface Statistics {
  avg: Incremean;
  max: number;
  min: number;
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
  const top3 = calculateChains();
  const after = Date.now();
  // const text = top3
  //   .map((res) => `${res[1]}-${res[2]}-${res[3]}-${res[1]}   +${res[0]}%`)
  //   .join('\n');
  // global.console.log('\n' + text);
  // global.console.log(`calculations took ${after - before}ms`);

  const time = after - before;
  addStatistics('time', time);
  top3.forEach((res) => addStatistics(`${res[1]}-${res[2]}-${res[3]}-${res[1]}`, res[0]));
}, 3000);

const server = express();
// server.use(express.json());
server.use(cors());

server.get('/state', (_, res) => {
  res.json(state.getState()).end();
});

server.get('/statistics', (_, res) => {
  res.json(statistics).end();
});

const port = 3010;
server.listen(port, () => global.console.log('server is listening on ' + port));
