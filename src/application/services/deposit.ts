import { TransactionRepositoryInterface } from "../../domain/transaction/repository";
import { UserRepositoryInterface } from "../../domain/user/repository";
import { AddBalanceUseCase } from "../use-cases/add-balance";
import { CreateTransactionUseCase } from "../use-cases/create-transaction";

export class DepositService {
  constructor(
    private userRepo: UserRepositoryInterface,
    private transactionRepo: TransactionRepositoryInterface
  ) {}

  public async execute(userId: string, value: number) {
    const user = await this.userRepo.getById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const addBalance = new AddBalanceUseCase(this.userRepo);
    await addBalance.execute(user, value);

    const createTransaction = new CreateTransactionUseCase(
      this.transactionRepo
    );
    await createTransaction.execute({
      userId: user.id,
      type: "DEPOSIT",
      value,
      balanceBefore: user.balance,
      balanceAfter: user.balance + value,
    });

    return user.balance + value;
  }
}
