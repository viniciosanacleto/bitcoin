import Joi from "joi";

const schema = Joi.object({
  page: Joi.number().min(1).required(),
  pageSize: Joi.number().min(1).required(),
});

export default function validateGetPositions(input: any) {
  return schema.validate(input);
}
