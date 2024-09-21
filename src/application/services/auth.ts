import jwt from "jsonwebtoken";
import { UserRepositoryInterface } from "../../domain/user/repository";
import { AuthenticateUserUseCase } from "../use-cases/authenticate-user";

export class AuthService {
  constructor(private userRepo: UserRepositoryInterface) {}

  public async execute(email: string, password: string) {
    const user = await this.userRepo.getByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }

    const authenticateUser = new AuthenticateUserUseCase();
    await authenticateUser.execute(user, password);

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT Secret not found in env file");
    }
    return jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });
  }
}
