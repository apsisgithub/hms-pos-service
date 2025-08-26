import { PartialType } from "@nestjs/swagger";
import { CreateMasterBuildingDto } from "./create-building.dto";

export class UpdateBuildingDto extends PartialType(CreateMasterBuildingDto) {}
