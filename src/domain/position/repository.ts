import { CreatePositionDTO } from "./dtos/create-position";
import { PositionEntity } from "./entities";

export interface PositionRepositoryInterface {
  create: (newPosition: CreatePositionDTO) => Promise<PositionEntity>;
}
