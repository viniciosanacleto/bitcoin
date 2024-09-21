import { CreateUserDTO } from "./dtos/create-user";
import { UserEntity } from "./entities";

export interface UserRepositoryInterface {
  create: (newUser: CreateUserDTO) => Promise<UserEntity>;
  getById: (id: string) => Promise<UserEntity | null>;
  getByEmail: (email: string) => Promise<UserEntity | null>;
  update: (user: UserEntity) => Promise<UserEntity>;
}
