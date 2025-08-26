import { PartialType } from "@nestjs/swagger";
import { CreateSeasonDto } from "./create-master-season.dto";

export class UpdateMasterSeasonDto extends PartialType(CreateSeasonDto) {}
