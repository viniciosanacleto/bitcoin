import { BtcPriceRepositoryInterface } from "../../domain/btc-price/repository";
import { PositionEntity } from "../../domain/position/entities";
import { PositionRepositoryInterface } from "../../domain/position/repository";
import { TransactionRepositoryInterface } from "../../domain/transaction/repository";
import { UserRepositoryInterface } from "../../domain/user/repository";
import { BitcoinMarketGatewayInterface } from "../../gateways/bitcoin-market/interface";
import { MailGatewayInterface } from "../../gateways/mail/interface";
import { ClosePositionUseCase } from "../use-cases/close-position";
import { CreateTransactionUseCase } from "../use-cases/create-transaction";
import { GetLastBtcPriceUseCase } from "../use-cases/get-last-btc-price";
import { OpenPositionUseCase } from "../use-cases/open-position";

export class SellBtcService {
  constructor(
    private positionRepo: PositionRepositoryInterface,
    private userRepo: UserRepositoryInterface,
    private transactionRepo: TransactionRepositoryInterface,
    private btcPriceRepo: BtcPriceRepositoryInterface,
    private btcMarket: BitcoinMarketGatewayInterface,
    private mailSender: MailGatewayInterface
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
        order: "desc",
        orderBy: "createdAt",
      });
      if (positions.length === 0) {
        break;
      }

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
    const user = await this.userRepo.getById(userId);
    if (!user) {
      throw new Error("User Not found");
    }

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

    const getLastBtcPrice = new GetLastBtcPriceUseCase(
      this.btcPriceRepo,
      this.btcMarket
    );
    const btcPriceNow = await getLastBtcPrice.execute();

    const closePosition = new ClosePositionUseCase(
      this.positionRepo,
      this.userRepo
    );
    const openPosition = new OpenPositionUseCase(
      this.userRepo,
      this.positionRepo
    );
    const createTransaction = new CreateTransactionUseCase(
      this.transactionRepo
    );

    // Close the positions selected to fill the BTC quantity that order required
    let closedBtcQty = 0;
    const userBalanceBefore = user.balance;
    for (const position of selectedPositions) {
      const remainingToBeClosed = btcQty - closedBtcQty;
      const valueEarned = position.btcQty * btcPriceNow.buy;

      await closePosition.execute(position, user, btcPriceNow.buy);

      await createTransaction.execute({
        userId: user.id,
        type: "POSITION_CLOSE",
        value: valueEarned,
        balanceBefore: user.balance,
        balanceAfter: user.balance + valueEarned,
        btcPrice: btcPriceNow.buy,
        btcQty: position.btcQty,
      });

      closedBtcQty += position.btcQty;
      user.balance += valueEarned;

      // If its a partial close of the position, create a new position with the residual BTC quantity with the original btc price of the position
      const residualQty = position.btcQty - remainingToBeClosed;
      if (residualQty > 0) {
        await openPosition.execute(user, residualQty, position.btcPrice);

        const valueReinvested = residualQty * position.btcPrice;
        await createTransaction.execute({
          userId: user.id,
          type: "POSITION_OPEN",
          value: valueReinvested,
          balanceBefore: user.balance,
          balanceAfter: user.balance - valueReinvested,
          btcPrice: position.btcPrice,
          btcQty: residualQty,
        });

        closedBtcQty -= residualQty;
        user.balance -= valueReinvested;
      }
    }

    try {
      await this.mailSender.send(
        user.email,
        "BTC Sell",
        `Bitcoin Quantity = ${closedBtcQty.toFixed(8)}\nValue = R$${(
          user.balance - userBalanceBefore
        ).toFixed(2)}`
      );
    } catch (e) {
      console.log(e);
    }

    return {
      btcPrice: btcPriceNow.buy,
      btcQty: closedBtcQty,
      balance: user.balance,
    };
  }
}
