import { CreateWalletDTO } from "./dtos/create-wallet";
import { WalletEntity } from "./entities";

export interface WalletRepositoryInterface {
  create: (newWallet: CreateWalletDTO) => Promise<WalletEntity>;
}
