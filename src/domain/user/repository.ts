import { CreateUserDTO } from "./dtos/create-user";
import { UserEntity } from "./entities";

export interface UserRepositoryInterface {
  create: (newUser: CreateUserDTO) => Promise<UserEntity>;
}
