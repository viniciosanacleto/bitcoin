import { PrismaClient, Transaction } from "@prisma/client";
import { CreateTransactionDTO } from "../../../../domain/transaction/dtos/create-transaction";
import { GetExtractDTO } from "../../../../domain/transaction/dtos/get-extract";
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

  public async extract(options: GetExtractDTO): Promise<TransactionEntity[]> {
    const page = options?.page && options?.page > 0 ? options?.page : 1;
    const pageSize = options?.pageSize || 10;

    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId: options.userId,
        createdAt: {
          lte: options.startAt,
          gte: options.endAt,
        },
      },
      take: pageSize,
      skip: pageSize * (page - 1),
      orderBy: {
        createdAt: "desc",
      },
    });

    return transactions.map((item) => this.modelToEntity(item));
  }

  public async count(userId: string): Promise<number> {
    return this.prisma.transaction.count({
      where: { userId },
    });
  }
}
