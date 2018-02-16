import Paybear from "../Paybear";
import { expect } from "chai";
const api = new Paybear({
  secret: process.env.PAYBEAR_TEST_SECRET,
  test: true
});

describe("Paybear Api", () => {
  it("Loads all currencies", async () => {
    const currencies = await api.getCurrencies();
    expect(currencies).to.exist;
    expect(currencies.btc.rate).to.be.above(100);
  });

  xit("Loads a specific currency", async () => {
    const litecoin = await api.getCurrency("LTC");
    const bitcoin = await api.getCurrency("BTC");
    console.log(bitcoin);
    expect(bitcoin.rate).to.be.above(litecoin.rate);
  });

  it("Loads rates for all currencies", async () => {
    const rates = await api.getRates("GBP");
    const btc = rates.btc.mid;
    const ltc = rates.ltc.mid;

    expect(btc).to.be.above(ltc);
  });

  it("Queries a transaction for a specific currency", async () => {
    const paymentResponse = await api.getPayment({
      crypto: "BTC",
      callback: "http://www.abc.xyz/paid/123"
    });
    console.log(paymentResponse);
    expect(paymentResponse.address).to.exist;
  });
});
