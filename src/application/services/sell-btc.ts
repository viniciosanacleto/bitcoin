import { PositionEntity } from "../../domain/position/entities";
import { PositionRepositoryInterface } from "../../domain/position/repository";
import { UserRepositoryInterface } from "../../domain/user/repository";
import { BitcoinMarketGatewayInterface } from "../../gateways/bitcoin-market/interface";
import { ClosePositionUseCase } from "../use-cases/close-position";
import { OpenPositionUseCase } from "../use-cases/open-position";

export class SellBtcService {
  constructor(
    private positionRepo: PositionRepositoryInterface,
    private userRepo: UserRepositoryInterface,
    private btcMarket: BitcoinMarketGatewayInterface
  ) {}

  private async getPositions(
    userId: string,
    btcQty: number
  ): Promise<PositionEntity[]> {
    let page = 1;
    let btcSum = 0;
    const selectedPositions = [];

    while (btcSum < btcQty) {
      const positions = await this.positionRepo.get({
        where: { userId },
        page,
        pageSize: 10,
        order: "asc",
        orderBy: "createdAt",
      });

      for (const position of positions) {
        btcSum += position.btcQty;
        selectedPositions.push(position);

        if (btcSum >= btcQty) {
          break;
        }
      }

      page++;
    }

    return selectedPositions;
  }

  public async execute(userId: string, btcQty: number) {
    if (btcQty <= 0) {
      throw Error("btcQty should be greater than 0");
    }

    const userBitcoinQty = await this.positionRepo.sumUserBtcQty(userId);
    if (btcQty > userBitcoinQty) {
      throw Error(
        "User does not have enough positions in BTC to close this operation"
      );
    }

    const selectedPositions = await this.getPositions(userId, btcQty);
    if (!selectedPositions) {
      throw new Error("No positions found to be closed");
    }

    const closePosition = new ClosePositionUseCase(
      this.positionRepo,
      this.userRepo
    );
    const openPosition = new OpenPositionUseCase(
      this.userRepo,
      this.positionRepo
    );
    const btcPriceNow = await this.btcMarket.getLastPrice();

    // Close the positions selected to fill the BTC quantity that order required
    let closedBtcQty = 0;
    for (const position of selectedPositions) {
      const remainingToBeClosed = btcQty - closedBtcQty;

      await closePosition.execute(position.id, btcPriceNow.buy);
      closedBtcQty += position.btcQty;

      // If its a partial close of the position, create a new position with the residual BTC quantity with the original btc price of the position
      const residualQty = position.btcQty - remainingToBeClosed;
      if (residualQty > 0) {
        await openPosition.execute(userId, residualQty, position.btcPrice);
      }
    }
  }
}
