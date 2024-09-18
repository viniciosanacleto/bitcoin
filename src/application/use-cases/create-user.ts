import { CreateUserDTO } from "../../domain/user/dtos/create-user";
import { UserRepository } from "../../infrastructure/database/prisma/repositories/user-repository";
import { encryptPass } from "../../shared/utils/encryptPass";
import Logger from "../../shared/utils/logger";

export class CreateUserUseCase {
  private logger = new Logger("CreateUserUseCase");

  constructor(private userRepo: UserRepository) {}

  public async execute(newUser: CreateUserDTO) {
    try {
      const encryptedPass = encryptPass(newUser.password);
      const user = await this.userRepo.create({
        ...newUser,
        password: encryptedPass,
      });
      this.logger.log(`New User created: [${user.id}]${user.email}`);
      return user;
    } catch (e) {
      this.logger.log(`Failed to create new user: ${e}`);
      throw new Error("Failed to create new user");
    }
  }
}
