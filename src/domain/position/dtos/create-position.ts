import { PositionEntity } from "../entities";

export type CreatePositionDTO = Pick<
  PositionEntity,
  "userId" | "value" | "btcPrice" | "btcQty"
>;
