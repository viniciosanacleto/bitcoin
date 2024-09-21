import Joi from "joi";

const schema = Joi.object({
  amount: Joi.number().required(),
});

export default function validateDeposit(input: { amount: number }) {
  return schema.validate(input);
}
