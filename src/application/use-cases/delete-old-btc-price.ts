import { BtcPriceRepositoryInterface } from "../../domain/btc-price/repository";
import { subtractDays } from "../../shared/utils/subtractDays";

export class DeleteOldBtcPriceUseCase {
  constructor(private btcPriceRepo: BtcPriceRepositoryInterface) {}

  public async execute(daysOld: number = 90) {
    const olderThan = subtractDays(daysOld);
    await this.btcPriceRepo.delete({
      where: {
        createdAt: {
          lte: olderThan,
        },
      },
    });
  }
}
