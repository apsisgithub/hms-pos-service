import { ApiProperty } from "@nestjs/swagger";
import {
    IsString,
    IsNotEmpty,
    IsEnum,
    IsArray,
    IsNumber,
    IsOptional,
} from "class-validator";
import {
    RoleName,
    RoleStatus,
} from "src/modules/master-roles/entities/master_roles.entity";


export class PermissionPrivilege {
    @ApiProperty({ description: "ID of Modules", example: 1 })
    @IsNumber()
    module_id: number;

    @ApiProperty({ description: "ID of permission action id", example: [ 1,2,3 ] })
    @IsArray()
    permission_action_ids: number[];
}

export class CreateMasterRoleDto {
    @ApiProperty({ description: "SBU ID of Modules", example: 1 })
    @IsNumber()
    sbu_id: number;

    @ApiProperty({ description: "Name of the role", enum: RoleName })
    @IsString()
    @IsNotEmpty()
    name: RoleName;

    @ApiProperty({
        description: "Status of the role",
        enum: RoleStatus,
        default: RoleStatus.Active,
    })
    @IsEnum(RoleStatus)
    @IsNotEmpty()
    status: RoleStatus = RoleStatus.Active;

    @ApiProperty({
        description: "Array of permission privileges",
        type: [PermissionPrivilege],
    })
    @IsArray()
    @IsOptional()
    permission_privileges: PermissionPrivilege[];
   
}
