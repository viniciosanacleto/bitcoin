import { PrismaClient, Transaction } from "@prisma/client";
import { CreateTransactionDTO } from "../../../../domain/transaction/dtos/create-transaction";
import { TransactionEntity } from "../../../../domain/transaction/entities";
import { TransactionRepositoryInterface } from "../../../../domain/transaction/repository";

export class TransactionRepository implements TransactionRepositoryInterface {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  private modelToEntity(model: Transaction): TransactionEntity {
    return {
      ...model,
      value: model.value.toNumber(),
      balanceBefore: model.balanceBefore.toNumber(),
      balanceAfter: model.balanceAfter.toNumber(),
      btcPrice: model?.btcPrice?.toNumber() || null,
      btcQty: model?.btcQty?.toNumber() || null,
    };
  }

  public async create(
    newTransaction: CreateTransactionDTO
  ): Promise<TransactionEntity> {
    const transaction = await this.prisma.transaction.create({
      data: newTransaction,
    });

    return this.modelToEntity(transaction);
  }
}
