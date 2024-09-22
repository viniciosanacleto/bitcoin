import { DeleteOldBtcPriceUseCase } from "../../application/use-cases/delete-old-btc-price";
import { BtcPriceRepository } from "../../infrastructure/database/prisma/repositories/btc-price-repository";

async () => {
  const deleteOlderBtcPrice = new DeleteOldBtcPriceUseCase(
    new BtcPriceRepository()
  );

  await deleteOlderBtcPrice.execute(90);
};
