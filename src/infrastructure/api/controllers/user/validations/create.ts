import Joi from "joi";
import { CreateUserDTO } from "../../../../../domain/user/dtos/create-user";

const schema = Joi.object({
  name: Joi.string().min(3).max(255).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(255).required(),
});

export default function validateCreateUser(input: CreateUserDTO) {
  return schema.validate(input);
}
