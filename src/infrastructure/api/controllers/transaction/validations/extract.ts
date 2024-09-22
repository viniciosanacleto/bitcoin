import Joi from "joi";
import { subtractDays } from "../../../../../shared/utils/subtractDays";

const schema = Joi.object({
  startAt: Joi.date().default(new Date()),
  endAt: Joi.date().default(subtractDays(90, new Date())),
  page: Joi.number().min(1).required(),
  pageSize: Joi.number().min(1).required(),
});

export default function validateExtract(input: any) {
  return schema.validate(input);
}
