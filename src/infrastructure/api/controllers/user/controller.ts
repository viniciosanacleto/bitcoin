import { Request, Response } from "express";
import { AuthService } from "../../../../application/services/auth";
import { DepositService } from "../../../../application/services/deposit";
import { GetBalanceService } from "../../../../application/services/get-balance";
import { CreateUserUseCase } from "../../../../application/use-cases/create-user";
import { AuthenticateUserDTO } from "../../../../domain/user/dtos/authenticate";
import { TransactionRepository } from "../../../database/prisma/repositories/transaction-repository";
import { UserRepository } from "../../../database/prisma/repositories/user-repository";
import { AuthenticatedRequest } from "../../middlewares/auth-middleware";
import validateCreateUser from "./validations/create";
import validateDeposit from "./validations/deposit";
import validateLogin from "./validations/login";

export class UserController {
  public async create(req: Request, res: Response) {
    const validatedBody = validateCreateUser(req.body);
    if (validatedBody.error) {
      res.status(400).json(validatedBody);
      return;
    }

    try {
      const createUser = new CreateUserUseCase(new UserRepository());
      await createUser.execute(validatedBody.value);
      res.status(201).send();
    } catch (e) {
      res.status(500).json({ error: (e as Error).message });
    }
  }

  public async login(req: Request, res: Response) {
    const validatedBody = validateLogin(req.body);
    if (validatedBody.error) {
      res.status(400).json(validatedBody);
      return;
    }
    const data = validatedBody.value as AuthenticateUserDTO;

    try {
      const auth = new AuthService(new UserRepository());
      const token = await auth.execute(data.email, data.password);
      res.json({ token });
    } catch (e) {
      //TODO Error treatment when is not a generic error, like user not found
      res.status(500).json({ error: (e as Error).message });
    }
  }

  public async balance(req: AuthenticatedRequest, res: Response) {
    if (!req.userId) {
      res.status(401).send();
      return;
    }

    try {
      const getBalance = new GetBalanceService(new UserRepository());
      const balance = await getBalance.execute(req.userId);

      res.json({ balance });
    } catch (e) {
      //TODO Error treatment when is not a generic error, like user not found

      res.status(500).json({ error: (e as Error).message });
    }
  }

  public async deposit(req: AuthenticatedRequest, res: Response) {
    if (!req.userId) {
      res.status(401).send();
      return;
    }

    const validatedBody = validateDeposit(req.body);
    if (validatedBody.error) {
      res.status(400).json(validatedBody);
      return;
    }
    const data = validatedBody.value as { amount: number };

    try {
      const deposit = new DepositService(
        new UserRepository(),
        new TransactionRepository()
      );
      const newBalance = await deposit.execute(req.userId, data.amount);

      res.json({ balance: newBalance });
    } catch (e) {
      //TODO Error treatment when is not a generic error, like user not found
      res.status(500).json({ error: (e as Error).message });
    }
  }
}
