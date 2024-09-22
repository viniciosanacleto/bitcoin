import { TransactionRepositoryInterface } from "../../domain/transaction/repository";

export class GetTransactionsVolumeService {
  constructor(private transactionRepo: TransactionRepositoryInterface) {}

  public async execute() {
    const qtyBtcSell = await this.transactionRepo.sumBtcQtySell();
    const qtyBtcBuy = await this.transactionRepo.sumBtcQtyBuy();

    return {
      qtyBtcBuy,
      qtyBtcSell,
    };
  }
}
