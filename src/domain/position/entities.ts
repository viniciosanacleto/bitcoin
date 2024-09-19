import { Entity } from "../shared/entity";
import { UserEntity } from "../user/entities";

export type PositionEntity = Entity & {
  userId: string;
  user?: UserEntity;
  value: number;
  btcPrice: number;
  btcQty: number;
};
