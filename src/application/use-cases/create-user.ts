import { CreateUserDTO } from "../../domain/user/dtos/create-user";
import { UserRepository } from "../../infrastructure/database/prisma/repositories/user-repository";
import { WalletRepository } from "../../infrastructure/database/prisma/repositories/wallet-repository";
import { encryptPass } from "../../shared/utils/encryptPass";
import Logger from "../../shared/utils/logger";

export class CreateUserUseCase {
  private logger = new Logger("CreateUserUseCase");

  constructor(private userRepo: UserRepository) {}

  public async execute(newUser: CreateUserDTO) {
    const balance = newUser.balance < 0 ? 0 : newUser.balance;

    const encryptedPass = encryptPass(newUser.password);
    const user = await this.userRepo.create({
      ...newUser,
      password: encryptedPass,
      balance,
    });
    this.logger.log(`New User created: [${user.id}]${user.email}`);
    return user;
  }
}
