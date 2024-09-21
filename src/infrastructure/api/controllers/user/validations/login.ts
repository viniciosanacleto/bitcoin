import Joi from "joi";
import { AuthenticateUserDTO } from "../../../../../domain/user/dtos/authenticate";

const schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export default function validateLogin(input: AuthenticateUserDTO) {
  return schema.validate(input);
}
