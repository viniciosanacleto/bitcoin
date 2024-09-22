import { CreateBtcPriceUseCase } from "../../application/use-cases/create-btc-price";
import { BtcPriceRepository } from "../../infrastructure/database/prisma/repositories/btc-price-repository";
import { MercadoBitcoinAPI } from "../../libs/mercado-bitcoin/api";

(async () => {
  const mercadoBitcoin = new MercadoBitcoinAPI();
  const createBtcPrice = new CreateBtcPriceUseCase(new BtcPriceRepository());

  const priceNow = await mercadoBitcoin.getLastPrice();

  await createBtcPrice.execute({
    buy: priceNow.buy,
    sell: priceNow.sell,
  });
})();
