import { PrismaClient, User } from "@prisma/client";
import { CreateUserDTO } from "../../../../domain/user/dtos/create-user";
import { UserEntity } from "../../../../domain/user/entities";
import { UserRepositoryInterface } from "../../../../domain/user/repository";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

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
    try {
      const user = await this.prisma.user.create({
        data: newUser,
      });

      return this.modelToEntity(user);
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError && e.code === "P2002") {
        throw new Error("User already exists");
      }

      throw e;
    }
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

  public async getByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
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
