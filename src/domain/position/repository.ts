import { GetOptions } from "../shared/repository";
import { CreatePositionDTO } from "./dtos/create-position";
import { PositionEntity } from "./entities";

export interface PositionRepositoryInterface {
  create: (newPosition: CreatePositionDTO) => Promise<PositionEntity>;
  get: (options?: GetOptions) => Promise<PositionEntity[]>;
  getById: (id: string) => Promise<PositionEntity | null>;
  deleteById: (id: string) => Promise<void>;
  sumUserBtcQty: (userId: string) => Promise<number>;
}
