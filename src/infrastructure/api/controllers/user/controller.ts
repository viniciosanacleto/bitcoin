import { Request, Response } from "express";
import { CreateUserUseCase } from "../../../../application/use-cases/create-user";
import { UserRepository } from "../../../database/prisma/repositories/user-repository";
import validateCreateUser from "./validations/create";
import validateLogin from "./validations/login";
import { AuthService } from "../../../../application/services/auth";
import { AuthenticateUserDTO } from "../../../../domain/user/dtos/authenticate";

export class UserController {
  public async create(req: Request, res: Response) {
    const userRepo = new UserRepository();

    const validatedBody = validateCreateUser(req.body);
    if (validatedBody.error) {
      res.status(400).json(validatedBody);
      return;
    }

    try {
      const createUser = new CreateUserUseCase(userRepo);
      await createUser.execute(validatedBody.value);
      res.status(201).send();
    } catch (e) {
      res.status(500).json({ error: (e as Error).message });
    }
  }

  public async login(req: Request, res: Response) {
    const userRepo = new UserRepository();

    const validatedBody = validateLogin(req.body);
    if (validatedBody.error) {
      res.status(400).json(validatedBody);
      return;
    }
    const data = validatedBody.value as AuthenticateUserDTO;

    try {
      const auth = new AuthService(userRepo);
      const token = await auth.execute(data.email, data.password);
      res.json({ token });
    } catch (e) {
      //TODO Error treatment when is not a generic error, like user not found

      res.status(500).json({ error: (e as Error).message });
    }
  }

  public async balance(req: Request, res: Response) {
    res.send("BALANCE")
  }
}
