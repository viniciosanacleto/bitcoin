import { Entity } from "../shared/entity";

export type UserEntity = Entity & {
  name: string;
  email: string;
  password: string;
  balance: number;
};
