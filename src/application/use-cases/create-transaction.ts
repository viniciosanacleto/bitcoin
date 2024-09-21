import { CreateTransactionDTO } from "../../domain/transaction/dtos/create-transaction";
import { TransactionRepositoryInterface } from "../../domain/transaction/repository";
import Logger from "../../shared/utils/logger";

export class CreateTransactionUseCase {
  private logger = new Logger("CreateTransactionUseCase");

  constructor(private transactionRepo: TransactionRepositoryInterface) {}

  public async execute(newTransaction: CreateTransactionDTO) {
    const transaction = await this.transactionRepo.create(newTransaction);
    this.logger.log(
      `New transaction created: [${transaction.id}] User=[${transaction.userId}], Type=${transaction.type}, Value=${transaction.value}, BalanceBefore=${transaction.balanceBefore}, BalanceAfter=${transaction.balanceAfter} `
    );
    return transaction;
  }
}
