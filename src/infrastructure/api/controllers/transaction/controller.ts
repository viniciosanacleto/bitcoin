import { Response } from "express";
import { GetExtractService } from "../../../../application/services/extract";
import { GetTransactionsVolumeService } from "../../../../application/services/transactions-volume";
import { TransactionRepository } from "../../../database/prisma/repositories/transaction-repository";
import { AuthenticatedRequest } from "../../middlewares/auth-middleware";
import validateExtract from "./validations/extract";

export class TransactionController {
  public async extract(req: AuthenticatedRequest, res: Response) {
    if (!req.userId) {
      res.status(401).send();
      return;
    }

    const validatedParams = validateExtract(req.query);
    if (validatedParams.error) {
      res.status(400).json(validatedParams);
      return;
    }
    const params = validatedParams.value as {
      startAt: Date;
      endAt: Date;
      page: number;
      pageSize: number;
    };

    try {
      const getExtract = new GetExtractService(new TransactionRepository());

      const response = await getExtract.execute(
        req.userId,
        params.page,
        params.pageSize,
        params.startAt,
        params.endAt
      );
      res.json(response);
    } catch (e) {
      res.status(500).json({ error: (e as Error).message });
      return;
    }
  }

  public async volume(req: AuthenticatedRequest, res: Response) {
    if (!req.userId) {
      res.status(401).send();
      return;
    }

    try {
      const getVolume = new GetTransactionsVolumeService(
        new TransactionRepository()
      );

      const volume = await getVolume.execute();
      res.json(volume);
    } catch (e) {
      res.status(500).json({ error: (e as Error).message });
      return;
    }
  }
}
