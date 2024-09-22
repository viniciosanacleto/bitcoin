import { BtcPrice, PrismaClient } from "@prisma/client";
import { CreateBtcPriceDTO } from "../../../../domain/btc-price/dtos/create-btc-price";
import { BtcPriceEntity } from "../../../../domain/btc-price/entities";
import { BtcPriceRepositoryInterface } from "../../../../domain/btc-price/repository";
import {
  DeleteOptions,
  GetOptions,
} from "../../../../domain/shared/repository";

export class BtcPriceRepository implements BtcPriceRepositoryInterface {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  private modelToEntity(model: BtcPrice): BtcPriceEntity {
    return {
      ...model,
      buy: model.buy.toNumber(),
      sell: model.sell.toNumber(),
    };
  }

  public async create(newBtcPrice: CreateBtcPriceDTO): Promise<BtcPriceEntity> {
    const btcPrice = await this.prisma.btcPrice.create({ data: newBtcPrice });
    return this.modelToEntity(btcPrice);
  }

  public async get(options?: GetOptions): Promise<BtcPriceEntity[]> {
    const page = options?.page && options?.page > 0 ? options?.page : 1;
    const pageSize = options?.pageSize || 10;
    const order = options?.order || "asc";
    const orderBy = options?.orderBy || "createdAt";

    const btcPrices = await this.prisma.btcPrice.findMany({
      where: options?.where,
      take: pageSize,
      skip: pageSize * (page - 1),
      orderBy: {
        [orderBy]: order,
      },
    });

    return btcPrices.map((item) => this.modelToEntity(item));
  }

  public async getLastPrice(): Promise<BtcPriceEntity | null> {
    const lastPrice = await this.prisma.btcPrice.findFirst({
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!lastPrice) {
      return null;
    }

    return this.modelToEntity(lastPrice);
  }

  public async delete(options?: DeleteOptions): Promise<void> {
    await this.prisma.btcPrice.deleteMany({
      where: options?.where,
    });
  }
}
