import { CreateUserDTO } from "../../domain/user/dtos/create-user";
import { UserRepositoryInterface } from "../../domain/user/repository";
import { encryptPass } from "../../shared/utils/encryptPass";
import Logger from "../../shared/utils/logger";

export class CreateUserUseCase {
  private logger = new Logger("CreateUserUseCase");

  constructor(private userRepo: UserRepositoryInterface) {}

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
