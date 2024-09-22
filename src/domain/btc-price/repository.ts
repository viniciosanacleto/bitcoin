import { DeleteOptions, GetOptions } from "../shared/repository";
import { CreateBtcPriceDTO } from "./dtos/create-btc-price";
import { BtcPriceEntity } from "./entities";

export interface BtcPriceRepositoryInterface {
  create: (newBtcPrice: CreateBtcPriceDTO) => Promise<BtcPriceEntity>;
  get: (options?: GetOptions) => Promise<BtcPriceEntity[]>;
  getLastPrice: () => Promise<BtcPriceEntity | null>;
  delete: (options?: DeleteOptions) => Promise<void>;
}
