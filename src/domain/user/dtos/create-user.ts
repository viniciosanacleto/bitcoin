import { UserEntity } from "../entities";

export type CreateUserDTO = Pick<UserEntity, "name" | "email" | "password" | "balance">;
