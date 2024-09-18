import { WalletEntity } from "../entities";

export type CreateWalletDTO = Pick<
  WalletEntity,
  "userId" | "currency" | "balance"
>;
