import { UserRepositoryInterface } from "../../domain/user/repository";

export class GetBalanceService {
  constructor(private userRepo: UserRepositoryInterface) {}

  public async execute(userId: string) {
    const user = await this.userRepo.getById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    return user.balance;
  }
}
