import bcrypt from "bcrypt";
import { UserEntity } from "../../domain/user/entities";

export class AuthenticateUserUseCase {
  public async execute(user: UserEntity, password: string) {
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new Error("Invalid password");
    }
  }
}
