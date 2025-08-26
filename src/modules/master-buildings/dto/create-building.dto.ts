import { ApiProperty, PartialType } from "@nestjs/swagger";
import {
    IsString,
    Length,
    IsNotEmpty,
    IsInt,
    IsOptional,
    IsEnum,
} from "class-validator";
import { BuildingStatus } from "../entities/master_building.entity";

export class CreateMasterBuildingDto {
    @ApiProperty({ description: "ID of the SBU this building belongs to" })
    @IsInt()
    @IsNotEmpty()
    sbu_id: number;

    @ApiProperty({ description: "Name of the building", maxLength: 255 })
    @IsString()
    @IsNotEmpty()
    @Length(1, 255)
    name: string;

    @ApiProperty({
        description: "Description of the building",
        required: false,
    })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({
        description: "Status of the building",
        enum: BuildingStatus,
        default: BuildingStatus.Active,
    })
    @IsEnum(BuildingStatus)
    @IsNotEmpty()
    status: BuildingStatus = BuildingStatus.Active;
}
