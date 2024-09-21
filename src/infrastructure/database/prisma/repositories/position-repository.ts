import { Position, PrismaClient } from "@prisma/client";
import { CreatePositionDTO } from "../../../../domain/position/dtos/create-position";
import { PositionEntity } from "../../../../domain/position/entities";
import { PositionRepositoryInterface } from "../../../../domain/position/repository";
import { GetOptions } from "../../../../domain/shared/repository";

export class PositionRepository implements PositionRepositoryInterface {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  private modelToEntity(position: Position): PositionEntity {
    return {
      ...position,
      value: position.value.toNumber(),
      btcPrice: position.btcPrice.toNumber(),
      btcQty: position.btcQty.toNumber(),
    };
  }

  public async create(newPosition: CreatePositionDTO): Promise<PositionEntity> {
    const position = await this.prisma.position.create({
      data: newPosition,
    });

    return this.modelToEntity(position);
  }

  public async get(options?: GetOptions): Promise<PositionEntity[]> {
    const page = options?.page && options?.page > 0 ? options?.page : 1;
    const pageSize = options?.pageSize || 10;
    const order = options?.order || "asc";
    const orderBy = options?.orderBy || "createdAt";

    const positions = await this.prisma.position.findMany({
      where: options?.where,
      take: pageSize,
      skip: pageSize * (page - 1),
      orderBy: {
        [orderBy]: order,
      },
    });

    return positions.map((item) => this.modelToEntity(item));
  }

  public async getById(id: string): Promise<PositionEntity | null> {
    const position = await this.prisma.position.findFirst({
      where: {
        id,
      },
    });

    if (!position) {
      return null;
    }

    return this.modelToEntity(position);
  }

  public async deleteById(id: string) {
    await this.prisma.position.delete({
      where: {
        id,
      },
    });
  }

  public async sumUserBtcQty(userId: string): Promise<number> {
    const result = await this.prisma.position.aggregate({
      _sum: {
        btcQty: true,
      },
      where: {
        userId: userId,
      },
    });

    return result._sum.btcQty?.toNumber() || 0;
  }
}
