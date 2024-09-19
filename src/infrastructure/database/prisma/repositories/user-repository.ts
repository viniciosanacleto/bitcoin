import { PrismaClient, User } from "@prisma/client";
import { CreateUserDTO } from "../../../../domain/user/dtos/create-user";
import { UserEntity } from "../../../../domain/user/entities";
import { UserRepositoryInterface } from "../../../../domain/user/repository";

export class UserRepository implements UserRepositoryInterface {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  private modelToEntity(user: User) {
    return {
      ...user,
      balance: user.balance.toNumber(),
    };
  }

  public async create(newUser: CreateUserDTO): Promise<UserEntity> {
    const user = await this.prisma.user.create({
      data: newUser,
    });

    return this.modelToEntity(user);
  }

  public async getById(id: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        id,
      },
    });

    if (!user) {
      return null;
    }

    return this.modelToEntity(user);
  }

  public async update(user: UserEntity): Promise<UserEntity> {
    const updated = await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        balance: user.balance,
        email: user.email,
        password: user.password,
      },
    });

    return this.modelToEntity(updated);
  }
}
