import { PositionRepositoryInterface } from "../../domain/position/repository";
import { TransactionRepositoryInterface } from "../../domain/transaction/repository";
import { UserRepositoryInterface } from "../../domain/user/repository";
import { BitcoinMarketGatewayInterface } from "../../gateways/bitcoin-market/interface";
import { MailGatewayInterface } from "../../gateways/mail/interface";
import { CreateTransactionUseCase } from "../use-cases/create-transaction";
import { OpenPositionUseCase } from "../use-cases/open-position";

export class BuyBtcService {
  constructor(
    private positionRepo: PositionRepositoryInterface,
    private userRepo: UserRepositoryInterface,
    private transactionRepo: TransactionRepositoryInterface,
    private btcMarket: BitcoinMarketGatewayInterface,
    private mailSender: MailGatewayInterface
  ) {}

  public async execute(userId: string, value: number) {
    const user = await this.userRepo.getById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    if (value <= 0) {
      throw new Error("Value should be greater than 0");
    }

    const btcPriceNow = await this.btcMarket.getLastPrice();
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
      await this.mailSender.send(
        user.email,
        "BTC Buy",
        `Value = R$${value.toFixed(2)}\nBitcoin Quantity = ${qtyToBuy.toFixed(
          8
        )}`
      );
    } catch (e) {
      console.log(e);
    }

    return {
      btcPrice: btcPriceNow.sell,
      btcQty: qtyToBuy,
    };
  }
}
