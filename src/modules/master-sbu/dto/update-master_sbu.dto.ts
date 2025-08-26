import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateMasterSbuDto } from "./create-master_sbu.dto";

export class UpdateMasterSbuDto extends PartialType(CreateMasterSbuDto) {}
