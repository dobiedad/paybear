# Paybear

A simple promise based wrapper for :

[<img src="http://forum.worldcoin.global/downloads/monthly_2018_01/paybear.png.a4796ad9031d16501dc9458e4b331480.png" alt="Paybear.io" width="200"/>](https://www.paybear.io/)

## Dependencies

[httpism](https://github.com/featurist/httpism)

## Install

### npm

    npm i paybear -S

### Usage

```JavaScript
import Paybear from 'paybear';

const options = {
  secret: 'SECRET_KEY',
  test:false, // if set to true api will use the test url
}

const paybear = new Paybear(options);
```

## Loads all currencies

```JavaScript
const currencies = await paybear.getCurrencies();
```

`response`

```
{
  btc:
   { walletLink: 'bitcoin:%s?amount=%s',
     title: 'Bitcoin',
     rate: 10083.804,
     minimum: null,
     metamask: false,
     maximum: null,
     maxConfirmations: 1,
     icon: '/btc.png',
     decimals: 8,
     code: 'BTC',
     blockExplorer: 'https://blockchain.info/address/%s'
    } ,
  ltc: { ... },
  eth: { ... }
}
```

### Load specific currency

```JavaScript
const btc = await paybear.getCurrency('btc');
```

`response`

```
{
   walletLink: 'bitcoin:%s?amount=%s',
   title: 'Bitcoin',
   rate: 10083.804,
   minimum: null,
   metamask: false,
   maximum: null,
   maxConfirmations: 1,
   icon: '/btc.png',
   decimals: 8,
   code: 'BTC',
   blockExplorer: 'https://blockchain.info/address/%s'
}
```

### Load rates

```JavaScript
const rates = await paybear.getRates('GBP');
```

`response`

```
{
   ltc:
   { poloniex: 161.9764142631329,
     hitbtc: 162.87867425000002,
     bittrex: 161.17632022855398,
     bitfinex: 161.7627261,
     mid: 161.94853371042174 },
  eth:
   { poloniex: 660.7088303143381,
     hitbtc: 664.1348622250001,
     bittrex: 662.373098962341,
     bitfinex: 660.9291767750001,
     mid: 662.0364920691699 }
}
```

### Create a charge

```JavaScript
const orderId = '123'
const paymentResponse = await paybear.getPayment({
  crypto: "BTC",
  callback: `http://www.abc.xyz/confirmations/${orderId}`
});
```

`response`

```
{ invoice: 'b0f92d1e8f673b1296d1f6743145016b',
  address: 'mheNSUoAsDYTSub2Uiwuw9mGKHvMtgQ1jH',
  blockExplorer: 'https://blockchain.info/address/mheNSUoAsDYTSub2Uiwuw9mGKHvMtgQ1jH' }
```
