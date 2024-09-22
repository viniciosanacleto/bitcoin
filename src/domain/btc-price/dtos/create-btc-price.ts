import { BtcPriceEntity } from "../entities";

export type CreateBtcPriceDTO = Pick<BtcPriceEntity, "buy" | "sell">;