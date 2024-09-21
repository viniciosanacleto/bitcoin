import { Request, Response } from "express";
import { CreateUserUseCase } from "../../../../application/use-cases/create-user";
import { UserRepository } from "../../../database/prisma/repositories/user-repository";
import validateCreateUser from "./validations/create";
import validateLogin from "./validations/login";
import { AuthService } from "../../../../application/services/auth";
import { AuthenticateUserDTO } from "../../../../domain/user/dtos/authenticate";
import { AuthenticatedRequest } from "../../middlewares/auth-middleware";
import { GetBalanceService } from "../../../../application/services/get-balance";
import { DepositService } from "../../../../application/services/deposit";
import { TransactionRepository } from "../../../database/prisma/repositories/transaction-repository";
import validateDeposit from "./validations/deposit";

export class UserController {
  public async create(req: Request, res: Response) {
    const validatedBody = validateCreateUser(req.body);
    if (validatedBody.error) {
      res.status(400).json(validatedBody);
      return;
    }

    try {
      const userRepo = new UserRepository();
      const createUser = new CreateUserUseCase(userRepo);
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
      const userRepo = new UserRepository();
      const auth = new AuthService(userRepo);
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
      const userRepo = new UserRepository();
      const getBalance = new GetBalanceService(userRepo);
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
      const userRepo = new UserRepository();
      const transactionRepo = new TransactionRepository();
      const deposit = new DepositService(userRepo, transactionRepo);
      const newBalance = await deposit.execute(req.userId, data.amount);

      res.json({ balance: newBalance });
    } catch (e) {
      //TODO Error treatment when is not a generic error, like user not found
      res.status(500).json({ error: (e as Error).message });
    }
  }
}
