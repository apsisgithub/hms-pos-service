import { ApiProperty, PartialType } from "@nestjs/swagger";
import {
    IsString,
    Length,
    IsNotEmpty,
    IsInt,
    IsOptional,
    IsObject,
    IsEnum,
} from "class-validator";
import { DepartmentStatus } from "../entities/master_departments.entity";

export class CreateMasterDepartmentDto {
    @ApiProperty({ description: "ID of the SBU this department belongs to" })
    @IsInt()
    @IsNotEmpty()
    sbu_id: number;

    @ApiProperty({
        description: "Name of the department (e.g., Housekeeping, Front Desk)",
        maxLength: 255,
    })
    @IsString()
    @IsNotEmpty()
    @Length(1, 255)
    name: string;

    @ApiProperty({
        description: "Description of the department",
        required: false,
    })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({
        description: "JSON object defining menu access for this department",
        required: false,
        type: Object,
    })
    @IsOptional()
    @IsObject()
    menu_access?: object;

    @ApiProperty({
        description: "Status of the department",
        enum: DepartmentStatus,
        default: DepartmentStatus.Active,
    })
    @IsEnum(DepartmentStatus)
    @IsNotEmpty()
    status: DepartmentStatus = DepartmentStatus.Active;
}
