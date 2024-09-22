import { Entity } from "../shared/entity";

export type BtcPriceEntity = Entity & {
  buy: number;
  sell: number;
};
