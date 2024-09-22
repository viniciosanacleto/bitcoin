import { AuthenticatedRequest } from "../../middlewares/auth-middleware";
import { Response } from "express";
import validateBuy from "./validations/buy";
import { BuyBtcService } from "../../../../application/services/buy-btc";
import { PositionRepository } from "../../../database/prisma/repositories/position-repository";
import { UserRepository } from "../../../database/prisma/repositories/user-repository";
import { TransactionRepository } from "../../../database/prisma/repositories/transaction-repository";
import { MercadoBitcoinAPI } from "../../../../libs/mercado-bitcoin/api";
import validateSell from "./validations/sell";
import { SellBtcService } from "../../../../application/services/sell-btc";
import { GetBtcPriceService } from "../../../../application/services/btc-price";
import { GetPositionsService } from "../../../../application/services/get-positions";
import validateGetPositions from "./validations/get-positions";
import { SendgridMail } from "../../../../libs/sendgrid/mail";

export class PositionController {
  public async buy(req: AuthenticatedRequest, res: Response) {
    if (!req.userId) {
      res.status(401).send();
      return;
    }

    const validatedBody = validateBuy(req.body);
    if (validatedBody.error) {
      res.status(400).json(validatedBody);
      return;
    }
    const data = validatedBody.value as { value: number };

    try {
      const positionRepo = new PositionRepository();
      const userRepo = new UserRepository();
      const transactionRepo = new TransactionRepository();
      const mercadoBitcoin = new MercadoBitcoinAPI();
      const sendgridEmail = new SendgridMail();
      const buyBtc = new BuyBtcService(
        positionRepo,
        userRepo,
        transactionRepo,
        mercadoBitcoin,
        sendgridEmail
      );
      const transaction = await buyBtc.execute(req.userId, data.value);
      res.json(transaction);
    } catch (e) {
      res.status(500).json({ error: (e as Error).message });
    }
  }

  public async sell(req: AuthenticatedRequest, res: Response) {
    if (!req.userId) {
      res.status(401).send();
      return;
    }

    const validatedBody = validateSell(req.body);
    if (validatedBody.error) {
      res.status(400).json(validatedBody);
      return;
    }
    const data = validatedBody.value as { quantity: number };

    try {
      const positionRepo = new PositionRepository();
      const userRepo = new UserRepository();
      const transactionRepo = new TransactionRepository();
      const mercadoBitcoin = new MercadoBitcoinAPI();
      const sendgridEmail = new SendgridMail();
      const sellBtc = new SellBtcService(
        positionRepo,
        userRepo,
        transactionRepo,
        mercadoBitcoin,
        sendgridEmail
      );

      const transaction = await sellBtc.execute(req.userId, data.quantity);
      res.json(transaction);
    } catch (e) {
      res.status(500).json({ error: (e as Error).message });
      return;
    }
  }

  public async price(req: AuthenticatedRequest, res: Response) {
    if (!req.userId) {
      res.status(401).send();
      return;
    }

    try {
      const mercadoBitcoin = new MercadoBitcoinAPI();
      const getPrice = new GetBtcPriceService(mercadoBitcoin);

      const price = await getPrice.execute();
      res.json(price);
    } catch (e) {
      res.status(500).json({ error: (e as Error).message });
      return;
    }
  }

  public async positions(req: AuthenticatedRequest, res: Response) {
    if (!req.userId) {
      res.status(401).send();
      return;
    }

    const validatedParams = validateGetPositions(req.query);
    if (validatedParams.error) {
      res.status(400).json(validatedParams);
      return;
    }
    const params = validatedParams.value as { page: number; pageSize: number };

    try {
      const positionRepo = new PositionRepository();
      const mercadoBitcoin = new MercadoBitcoinAPI();
      const getPositions = new GetPositionsService(
        positionRepo,
        mercadoBitcoin
      );

      const response = await getPositions.execute(
        req.userId,
        params.page,
        params.pageSize
      );
      res.json(response);
    } catch (e) {
      res.status(500).json({ error: (e as Error).message });
      return;
    }
  }
}
