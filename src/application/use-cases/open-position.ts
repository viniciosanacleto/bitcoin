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
    private positionRepo: PositionRepositoryInterface
  ) {}

  public async execute(
    userId: string,
    qty: number,
    btcPrice: number
  ): Promise<PositionEntity> {
    const user = await this.userRepo.getById(userId);
    if (!user) {
      throw new Error("User not found!");
    }

    const value = qty * btcPrice;
    const newBalance = user.balance - value;
    if (newBalance < 0) {
      throw new Error("User has no enough balance to open this position");
    }

    //TODO Database transaction

    await this.userRepo.update({ ...user, balance: newBalance });
    this.logger.log(
      `Balance subtracted for User: [${user.id}] Value=${value} PreviousBalance=${user.balance} NewBalance=${newBalance}`
    );

    const btcQty = value / btcPrice;
    const newPosition: CreatePositionDTO = {
      btcPrice: btcPrice,
      btcQty: btcQty,
      value,
      userId,
    };
    const position = await this.positionRepo.create(newPosition);
    this.logger.log(
      `New position created: [${position.id}] Value=${value}, BtcQTY=${btcQty}, BtcPrice=${btcPrice}`
    );
    return position;
  }
}
