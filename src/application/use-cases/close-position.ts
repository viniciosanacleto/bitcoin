import { PositionEntity } from "../../domain/position/entities";
import { PositionRepositoryInterface } from "../../domain/position/repository";
import { UserEntity } from "../../domain/user/entities";
import { UserRepositoryInterface } from "../../domain/user/repository";
import { BitcoinMarketGatewayInterface } from "../../gateways/bitcoin-market/interface";
import Logger from "../../shared/utils/logger";

export class ClosePositionUseCase {
  private logger = new Logger("ClosePositionUseCase");

  constructor(
    private positionRepo: PositionRepositoryInterface,
    private userRepo: UserRepositoryInterface
  ) {}

  public async execute(
    position: PositionEntity,
    user: UserEntity,
    btcPrice: number
  ): Promise<void> {
    await this.positionRepo.deleteById(position.id);
    this.logger.log(
      `Position closed: [${position.id}] BtcQty=${position.btcQty}`
    );

    const sellValue = position.btcQty * btcPrice;
    const newBalance = user.balance + sellValue;

    await this.userRepo.update({ ...user, balance: newBalance });
    this.logger.log(
      `Balance added for User: [${user.id}] Value=${sellValue} PreviousBalance=${user.balance} NewBalance=${newBalance}`
    );
  }
}
