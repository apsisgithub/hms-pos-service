import { PartialType } from "@nestjs/swagger";
import { CreateMasterRateTypeDto } from "./create-master-rate-type.dto";

export class UpdateMasterRateTypeDto extends PartialType(
    CreateMasterRateTypeDto
) {}
