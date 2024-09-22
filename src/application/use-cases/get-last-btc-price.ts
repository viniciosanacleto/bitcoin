import { BtcPriceRepositoryInterface } from "../../domain/btc-price/repository";
import { BitcoinMarketGatewayInterface } from "../../gateways/bitcoin-market/interface";

export class GetLastBtcPriceUseCase {
  constructor(
    private btcPriceRepo: BtcPriceRepositoryInterface,
    private btcMarket: BitcoinMarketGatewayInterface
  ) {}

  public async execute() {
    // Try get the last price from DB
    const btcLastPrice = await this.btcPriceRepo.getLastPrice();

    //If there's no price in DB, go online
    if (!btcLastPrice) {
      const btcMarketLastPrice = await this.btcMarket.getLastPrice();
      return {
        buy: btcMarketLastPrice.buy,
        sell: btcMarketLastPrice.sell,
        createdAt: new Date(btcMarketLastPrice.timestamp * 1000),
      };
    }

    return {
      buy: btcLastPrice.buy,
      sell: btcLastPrice.sell,
      createdAt: btcLastPrice.createdAt,
    };
  }
}
