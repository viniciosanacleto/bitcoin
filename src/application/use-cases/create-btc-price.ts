import { CreateBtcPriceDTO } from "../../domain/btc-price/dtos/create-btc-price";
import { BtcPriceRepositoryInterface } from "../../domain/btc-price/repository";
import Logger from "../../shared/utils/logger";

export class CreateBtcPriceUseCase {
  private logger = new Logger("CreateBtcPriceUseCase");

  constructor(private btcPriceRepo: BtcPriceRepositoryInterface) {}

  public async execute(newBtcPrice: CreateBtcPriceDTO) {
    const btcPrice = await this.btcPriceRepo.create(newBtcPrice);
    this.logger.log(
      `New BtcPrice created: [${btcPrice.id}] Buy=${btcPrice.buy}, Sell=${btcPrice.sell}`
    );
    return btcPrice;
  }
}
