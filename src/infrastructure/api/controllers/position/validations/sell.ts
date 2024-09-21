import Joi from "joi";

const schema = Joi.object({
  quantity: Joi.number().required(),
});

export default function validateSell(input: any) {
  return schema.validate(input);
}
