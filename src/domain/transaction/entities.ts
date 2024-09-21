import { User } from "@prisma/client";
import { Entity } from "../shared/entity";

export type TransactionEntity = Entity & {
  userId: string;
  user?: User;
  type: string | "DEPOSIT" | "POSITION_OPEN" | "POSITION_CLOSE";
  value: number;
  balanceBefore: number;
  balanceAfter: number;
  btcQty: number | null;
  btcPrice: number | null;
};
