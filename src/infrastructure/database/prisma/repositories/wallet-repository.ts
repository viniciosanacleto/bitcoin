import { PrismaClient, Wallet } from "@prisma/client";
import { CreateWalletDTO } from "../../../../domain/wallet/dtos/create-wallet";
import { WalletEntity } from "../../../../domain/wallet/entities";
import { WalletRepositoryInterface } from "../../../../domain/wallet/repository";

export class WalletRepository implements WalletRepositoryInterface {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  private modelToEntity(wallet: Wallet): WalletEntity {
    return {
      ...wallet,
      balance: wallet.balance.toNumber(),
    };
  }

  public async create(newWallet: CreateWalletDTO): Promise<WalletEntity> {
    const wallet = await this.prisma.wallet.create({
      data: newWallet,
    });

    return this.modelToEntity(wallet);
  }
}
