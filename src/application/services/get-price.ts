import { BitcoinMarketGatewayInterface } from "../../gateways/bitcoin-market/interface";

export class GetPriceService {
  constructor(private bitcoinMarket: BitcoinMarketGatewayInterface) {}

  public async execute() {
    return this.bitcoinMarket.getLastPrice();
  }
}
