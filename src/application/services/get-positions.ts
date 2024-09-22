import { PositionRepositoryInterface } from "../../domain/position/repository";
import { BitcoinMarketGatewayInterface } from "../../gateways/bitcoin-market/interface";
import { PositionEntity } from "../../domain/position/entities";
import { BtcPriceRepositoryInterface } from "../../domain/btc-price/repository";
import { GetLastBtcPriceUseCase } from "../use-cases/get-last-btc-price";

export class GetPositionsService {
  constructor(
    private positionRepo: PositionRepositoryInterface,
    private btcPriceRepo: BtcPriceRepositoryInterface,
    private bitcoinMarket: BitcoinMarketGatewayInterface
  ) {}

  public async execute(userId: string, page: number, pageSize: number) {
    const count = await this.positionRepo.count(userId);
    if (count === 0) {
      throw new Error("User doesn't have open positions");
    }

    const positions = await this.positionRepo.get({
      where: { userId },
      page: page <= 0 ? 1 : page,
      pageSize: pageSize <= 0 ? 10 : pageSize,
    });

    const getLastBtcPrice = new GetLastBtcPriceUseCase(
      this.btcPriceRepo,
      this.bitcoinMarket
    );
    const btcPriceNow = await getLastBtcPrice.execute();

    const calculatedPositions = positions.map((position: PositionEntity) => {
      const currentValue = position.btcQty * btcPriceNow.buy;
      const priceVariationPercent =
        (btcPriceNow.buy - position.btcPrice) / position.btcPrice;
      const valueVariationPercent =
        (currentValue - position.value) / position.value;

      return {
        value: position.value,
        price: position.btcPrice,
        qty: position.btcQty,
        openedAt: position.createdAt,
        currentPrice: btcPriceNow.buy,
        currentValue,
        priceVariationPercent,
        valueVariationPercent,
      };
    });

    return {
      positions: calculatedPositions,
      pagination: {
        page,
        pageSize,
        totalPages: Math.ceil(count / pageSize),
        count,
      },
    };
  }
}
