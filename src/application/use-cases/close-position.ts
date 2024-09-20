import { PositionRepositoryInterface } from "../../domain/position/repository";
import { UserRepositoryInterface } from "../../domain/user/repository";
import { BitcoinMarketGatewayInterface } from "../../gateways/bitcoin-market/interface";
import Logger from "../../shared/utils/logger";

export class ClosePositionUseCase {
  private logger = new Logger("ClosePositionUseCase");

  constructor(
    private positionRepo: PositionRepositoryInterface,
    private userRepo: UserRepositoryInterface
  ) {}

  public async execute(positionId: string, btcPrice: number): Promise<void> {
    const position = await this.positionRepo.getById(positionId);
    if (!position) {
      throw new Error("Position not found!");
    }

    const user = await this.userRepo.getById(position.userId);
    if (!user) {
      throw new Error("User not found!");
    }

    await this.positionRepo.deleteById(position.id);
    this.logger.log(
      `Position closed: [${positionId}] BtcQty=${position.btcQty}`
    );

    const sellValue = position.btcQty * btcPrice;
    const newBalance = user.balance + sellValue;

    await this.userRepo.update({ ...user, balance: newBalance });
    this.logger.log(
      `Balance added for User: [${user.id}] Value=${sellValue} PreviousBalance=${user.balance} NewBalance=${newBalance}`
    );
  }
}
