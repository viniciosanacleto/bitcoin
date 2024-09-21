import { TransactionEntity } from "../entities";

export type CreateTransactionDTO = Pick<
  TransactionEntity,
  "userId" | "type" | "value" | "balanceBefore" | "balanceAfter"
> &
  Partial<Pick<TransactionEntity, "btcQty" | "btcPrice">>;
