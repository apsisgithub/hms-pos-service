import { PartialType } from "@nestjs/swagger";
import { CreateMasterRoleDto } from "./create-master-role.dto";

export class UpdateMasterRoleDto extends PartialType(CreateMasterRoleDto) {}
