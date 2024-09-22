import { BitcoinMarketGatewayInterface } from "../../gateways/bitcoin-market/interface";

export class GetBtcPriceService {
  constructor(private bitcoinMarket: BitcoinMarketGatewayInterface) {}

  public async execute() {
    return this.bitcoinMarket.getLastPrice();
  }
}
