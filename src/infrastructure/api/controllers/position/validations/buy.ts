import Joi from "joi";

const schema = Joi.object({
  value: Joi.number().required(),
});

export default function validateBuy(input: any) {
  return schema.validate(input);
}
