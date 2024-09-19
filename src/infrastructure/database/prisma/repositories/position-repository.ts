import { Position, PrismaClient } from "@prisma/client";
import { PositionRepositoryInterface } from "../../../../domain/position/repository";
import { CreatePositionDTO } from "../../../../domain/position/dtos/create-position";
import { PositionEntity } from "../../../../domain/position/entities";

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
}
