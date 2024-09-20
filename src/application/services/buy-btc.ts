import { PositionRepositoryInterface } from "../../domain/position/repository";
import { UserRepositoryInterface } from "../../domain/user/repository";
import { BitcoinMarketGatewayInterface } from "../../gateways/bitcoin-market/interface";
import { OpenPositionUseCase } from "../use-cases/open-position";

export class BuyBtcService {
  constructor(
    private positionRepo: PositionRepositoryInterface,
    private userRepo: UserRepositoryInterface,
    private btcMarket: BitcoinMarketGatewayInterface
  ) {}

  public async execute(userId: string, value: number) {
    if (value <= 0) {
      throw new Error("Value should be greater than 0");
    }

    const btcPriceNow = await this.btcMarket.getLastPrice();
    const qtyToBuy = value / btcPriceNow.sell;

    const openPosition = new OpenPositionUseCase(
      this.userRepo,
      this.positionRepo
    );
    await openPosition.execute(userId, qtyToBuy, btcPriceNow.sell);
  }
}
