import Joi from "joi";

const schema = Joi.object({
  page: Joi.number().min(1).default(1),
  pageSize: Joi.number().min(1).default(10),
});

export default function validateGetPositions(input: any) {
  return schema.validate(input);
}
