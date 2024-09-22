import { TransactionRepositoryInterface } from "../../domain/transaction/repository";

export class GetExtractService {
  constructor(private transactionRepo: TransactionRepositoryInterface) {}

  public async execute(
    userId: string,
    page: number,
    pageSize: number,
    startAt: Date,
    endAt: Date
  ) {
    const count = await this.transactionRepo.count(userId);
    if (count === 0) {
      throw new Error(
        `User doesn't have transactions for the specified period: startAt=${startAt}, endAt=${endAt}`
      );
    }

    const transactions = await this.transactionRepo.extract({
      page,
      pageSize,
      startAt,
      endAt,
      userId,
    });

    return {
      transactions,
      pagination: {
        page,
        pageSize,
        totalPages: Math.ceil(count / pageSize),
        count,
      },
    };
  }
}
