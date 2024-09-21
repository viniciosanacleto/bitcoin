import { CreateTransactionDTO } from "./dtos/create-transaction";
import { TransactionEntity } from "./entities";

export interface TransactionRepositoryInterface {
  create: (newTransaction: CreateTransactionDTO) => Promise<TransactionEntity>;
}
