const http = require("httpism");
const testBaseUrl = "https://test.paybear.io/v2/";
const baseUrl = "https://api.paybear.io/v2/";

export default class Paybear {
  constructor(options) {
    this.secret = options.secret;
    this.http = http.client(options.test ? testBaseUrl : baseUrl);
    this.test = options.test;
    this.blockExplorers = {};
  }

  async getCurrencies() {
    return this.fetch(`currencies?token=${this.secret}`).then(currencies => {
      const arrayOfCurrencies = Object.keys(currencies).map(k => currencies[k]);
      arrayOfCurrencies.map(currency => {
        const currencyCode = currency.code.toLowerCase();
        this.blockExplorers[currencyCode] =
          this.test && currencyCode === "btc"
            ? "https://live.blockcypher.com/btc-testnet/address/"
            : currency.blockExplorer.replace(/[\|&;\$%@"<>\(\)\+,]/g, "");
      });
      return currencies;
    });
  }

  async getCurrency(currency) {
    return this.getCurrencies().then(currencies => {
      return currencies[currency.toLowerCase()];
    });
  }

  async getRates(currency) {
    return this.fetch(`exchange/${currency}/rate`);
  }

  async getPayment(options) {
    const crypto = options.crypto.toLowerCase();
    return this.fetch(
      `${crypto}/payment/${encodeURIComponent(options.callback)}?token=${
        this.secret
      }`
    ).then(paymentResponse => {
      paymentResponse.blockExplorer =
        this.blockExplorers[crypto] + paymentResponse.address;
      return paymentResponse;
    });
  }

  async fetch(url) {
    return this.http
      .get(url)
      .then(response => {
        return response.data;
      })
      .catch(res => {
        throw new Error(JSON.stringify(res.body.errors));
      });
  }
}
