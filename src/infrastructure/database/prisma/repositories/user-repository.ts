import { PrismaClient } from "@prisma/client";
import { CreateUserDTO } from "../../../../domain/user/dtos/create-user";
import { UserEntity } from "../../../../domain/user/entities";
import { UserRepositoryInterface } from "../../../../domain/user/repository";

export class UserRepository implements UserRepositoryInterface {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  public async create(newUser: CreateUserDTO): Promise<UserEntity> {
    return this.prisma.user.create({
      data: newUser,
    });
  }
}
