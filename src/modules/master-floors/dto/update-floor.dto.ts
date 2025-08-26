import { PartialType } from "@nestjs/swagger";
import { CreateMasterFloorDto } from "./create-floor.dto";

export class UpdateFloorDto extends PartialType(CreateMasterFloorDto) {}
