import { CreateWalletDTO } from "../../domain/wallet/dtos/create-wallet";
import { WalletRepositoryInterface } from "../../domain/wallet/repository";
import Logger from "../../shared/utils/logger";

export class CreateWalletUseCase {
  private logger = new Logger("CreateWalletUseCase");

  constructor(private walletRepo: WalletRepositoryInterface) {}

  public async execute(newWallet: CreateWalletDTO) {
    try {
      const wallet = await this.walletRepo.create(newWallet);
      this.logger.log(
        `New Wallet created for user [${wallet.userId}]: [${wallet.id}] Currency="${wallet.currency}", Balance=${wallet.balance}`
      );
      return wallet;
    } catch (e) {
      this.logger.log(`Failed to create new Wallet: ${e}`);
      throw new Error("Failed to create new Wallet");
    }
  }
}
