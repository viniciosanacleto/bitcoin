import { UserRepositoryInterface } from "../../domain/user/repository";
import Logger from "../../shared/utils/logger";

export class AddBalanceUseCase {
  private logger = new Logger("AddBalanceUseCase");

  constructor(private userRepo: UserRepositoryInterface) {}

  public async execute(userId: string, value: number) {
    if (value <= 0) {
      throw new Error("Value should be greater than 0");
    }

    const user = await this.userRepo.getById(userId);
    if (!user) {
      throw new Error("User does not exist");
    }

    const updatedUser = await this.userRepo.update({
      ...user,
      balance: user.balance + value,
    });
    this.logger.log(
      `New value added to the user balance: [${user.id}] Value=${value}, NewBalance=${updatedUser.balance}`
    );

    return updatedUser;
  }
}
