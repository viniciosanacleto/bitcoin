import { BtcPriceRepositoryInterface } from "../../domain/btc-price/repository";
import { PositionRepositoryInterface } from "../../domain/position/repository";
import { TransactionRepositoryInterface } from "../../domain/transaction/repository";
import { UserRepositoryInterface } from "../../domain/user/repository";
import { BitcoinMarketGatewayInterface } from "../../gateways/bitcoin-market/interface";
import {
  MailControllerInterface
} from "../../gateways/mail/interfaces";
import { CreateTransactionUseCase } from "../use-cases/create-transaction";
import { GetLastBtcPriceUseCase } from "../use-cases/get-last-btc-price";
import { OpenPositionUseCase } from "../use-cases/open-position";

export class BuyBtcService {
  constructor(
    private positionRepo: PositionRepositoryInterface,
    private userRepo: UserRepositoryInterface,
    private transactionRepo: TransactionRepositoryInterface,
    private btcPriceRepo: BtcPriceRepositoryInterface,
    private btcMarket: BitcoinMarketGatewayInterface,
    private mailController: MailControllerInterface
  ) {}

  public async execute(userId: string, value: number) {
    const user = await this.userRepo.getById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    if (value <= 0) {
      throw new Error("Value should be greater than 0");
    }

    const getLastBtcPrice = new GetLastBtcPriceUseCase(
      this.btcPriceRepo,
      this.btcMarket
    );
    const btcPriceNow = await getLastBtcPrice.execute();
    const qtyToBuy = value / btcPriceNow.sell;

    const openPosition = new OpenPositionUseCase(
      this.userRepo,
      this.positionRepo
    );
    await openPosition.execute(user, qtyToBuy, btcPriceNow.sell);

    const createTransaction = new CreateTransactionUseCase(
      this.transactionRepo
    );
    await createTransaction.execute({
      userId: user.id,
      type: "POSITION_OPEN",
      value: value,
      balanceBefore: user.balance,
      balanceAfter: user.balance - value,
      btcQty: qtyToBuy,
      btcPrice: btcPriceNow.sell,
    });

    try {
      await this.mailController.dispatch({
        email: user.email,
        subject: "BTC Buy",
        text: `Value = R$${value.toFixed(
          2
        )}\nBitcoin Quantity = ${qtyToBuy.toFixed(8)}`,
      });
    } catch (e) {
      console.log("Failed to send email:", e);
    }

    return {
      btcPrice: btcPriceNow.sell,
      btcQty: qtyToBuy,
    };
  }
}
