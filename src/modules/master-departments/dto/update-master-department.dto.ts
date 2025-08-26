import { PartialType } from "@nestjs/swagger";
import { CreateMasterDepartmentDto } from "./create-master-department.dto";

export class UpdateMasterDepartmentDto extends PartialType(
    CreateMasterDepartmentDto
) {}
