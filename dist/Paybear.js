"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var http = require("httpism");
var testBaseUrl = "https://test.paybear.io/v2/";
var baseUrl = "https://api.paybear.io/v2/";

var Paybear = function () {
  function Paybear(options) {
    _classCallCheck(this, Paybear);

    this.secret = options.secret;
    this.http = http.client(options.test ? testBaseUrl : baseUrl);
    this.test = options.test;
    this.blockExplorers = {};
  }

  _createClass(Paybear, [{
    key: "getCurrencies",
    value: async function getCurrencies() {
      var _this = this;

      return this.fetch("currencies?token=" + this.secret).then(function (currencies) {
        var arrayOfCurrencies = Object.keys(currencies).map(function (k) {
          return currencies[k];
        });
        arrayOfCurrencies.map(function (currency) {
          var currencyCode = currency.code.toLowerCase();
          _this.blockExplorers[currencyCode] = _this.test && currencyCode === "btc" ? "https://live.blockcypher.com/btc-testnet/address/" : currency.blockExplorer.replace(/[\|&;\$%@"<>\(\)\+,]/g, "");
        });
        return currencies;
      });
    }
  }, {
    key: "getCurrency",
    value: async function getCurrency(currency) {
      return this.getCurrencies().then(function (currencies) {
        return currencies[currency.toLowerCase()];
      });
    }
  }, {
    key: "getRates",
    value: async function getRates(currency) {
      return this.fetch("exchange/" + currency + "/rate");
    }
  }, {
    key: "getPayment",
    value: async function getPayment(options) {
      var _this2 = this;

      var crypto = options.crypto.toLowerCase();
      return this.fetch(crypto + "/payment/" + encodeURIComponent(options.callback) + "?token=" + this.secret).then(function (paymentResponse) {
        paymentResponse.blockExplorer = _this2.blockExplorers[crypto] + paymentResponse.address;
        return paymentResponse;
      });
    }
  }, {
    key: "fetch",
    value: async function fetch(url) {
      return this.http.get(url).then(function (response) {
        return response.data;
      }).catch(function (res) {
        throw new Error(JSON.stringify(res.body.errors));
      });
    }
  }]);

  return Paybear;
}();

exports.default = Paybear;