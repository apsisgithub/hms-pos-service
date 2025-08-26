import { PartialType } from "@nestjs/swagger";
import { CreateMasterDisplaySettingDto } from "./create-master-display-setting.dto";

export class UpdateMasterDisplaySettingDto extends PartialType(
    CreateMasterDisplaySettingDto
) {}
