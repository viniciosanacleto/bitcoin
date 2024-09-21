import { UserEntity } from "../entities";

export type AuthenticateUserDTO = Pick<UserEntity, "email" | "password">;
