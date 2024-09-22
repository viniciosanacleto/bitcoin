import { CreateTransactionDTO } from "./dtos/create-transaction";
import { GetExtractDTO } from "./dtos/get-extract";
import { TransactionEntity } from "./entities";

export interface TransactionRepositoryInterface {
  create: (newTransaction: CreateTransactionDTO) => Promise<TransactionEntity>;
  extract: (extractOptions: GetExtractDTO) => Promise<TransactionEntity[]>;
  count: (userId: string) => Promise<number>;
}
