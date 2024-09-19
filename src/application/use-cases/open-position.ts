import { CreatePositionDTO } from "../../domain/position/dtos/create-position";
import { PositionEntity } from "../../domain/position/entities";
import { PositionRepositoryInterface } from "../../domain/position/repository";
import { UserRepositoryInterface } from "../../domain/user/repository";
import { BitcoinMarketGatewayInterface } from "../../gateways/bitcoin-market/interface";
import Logger from "../../shared/utils/logger";

export class OpenPositionUseCase {
  private logger = new Logger("OpenPositionUseCase");

  constructor(
    private userRepo: UserRepositoryInterface,
    private positionRepo: PositionRepositoryInterface,
    private bitcoinMarket: BitcoinMarketGatewayInterface
  ) {}

  public async execute(userId: string, value: number): Promise<PositionEntity> {
    const user = await this.userRepo.getById(userId);
    if (!user) {
      throw new Error("User not found!");
    }

    const newBalance = user.balance - value;
    if (newBalance < 0) {
      throw new Error("User has no enough balance to open this position");
    }

    const bitcoinPrice = await this.bitcoinMarket.getLastPrice();

    //TODO Database transaction

    await this.userRepo.update({ ...user, balance: newBalance });
    this.logger.log(
      `Balance updated for User: [${user.id}] ActualBalance=${user.balance} NewBalance=${newBalance}`
    );

    const btcQty = value / bitcoinPrice.sell;
    const newPosition: CreatePositionDTO = {
      btcPrice: bitcoinPrice.sell,
      btcQty: btcQty,
      value,
      userId,
    };
    const position = await this.positionRepo.create(newPosition);
    this.logger.log(
      `New position created: [${position.id}] Value=${value}, BtcQTY=${btcQty}, BtcPrice=${bitcoinPrice.sell}`
    );
    return position;
  }
}
