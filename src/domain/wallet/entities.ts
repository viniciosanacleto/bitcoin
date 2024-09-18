import { Entity } from "../shared/entity";
import { UserEntity } from "../user/entities";

export type WalletEntity = Entity & {
  userId: string;
  user?: UserEntity;
  currency: string;
  balance: number;
};
