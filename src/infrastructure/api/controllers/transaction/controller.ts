import { AuthenticatedRequest } from "../../middlewares/auth-middleware";
import { Response } from "express";
import validateExtract from "./validations/extract";
import { subtractDays } from "../../../../shared/utils/subtractDays";
import { TransactionRepository } from "../../../database/prisma/repositories/transaction-repository";
import { GetExtractService } from "../../../../application/services/extract";

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
      const transactionRepo = new TransactionRepository();
      const getExtract = new GetExtractService(transactionRepo);

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
}
