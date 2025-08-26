import { ApiProperty, PartialType } from "@nestjs/swagger";
import {
    IsString,
    Length,
    IsNotEmpty,
    IsInt,
    IsOptional,
    IsEnum,
    Min,
} from "class-validator";
import { FloorStatus } from "../entities/master_floor.entity";
import { Type } from "class-transformer";

export class CreateMasterFloorDto {
    @ApiProperty({ description: "ID of the SBU this floor belongs to" })
    @IsInt()
    @IsNotEmpty()
    sbu_id: number;

    @ApiProperty({ description: "ID of the building this floor is in" })
    @IsInt()
    @IsNotEmpty()
    building_id: number;

    @ApiProperty({
        description: "Name of the floor (e.g., Ground Floor)",
        maxLength: 100,
    })
    @IsString()
    @IsNotEmpty()
    @Length(1, 100)
    name: string;

    @ApiProperty({ description: "Floor number" })
    @IsInt()
    @IsOptional()
    @Min(0)
    number: number;

    @ApiProperty({ description: "Sort order for display", required: false })
    @IsOptional()
    @IsInt()
    @IsOptional()
    @Type(() => Number)
    sort_order?: number;

    @ApiProperty({
        description: "Status of the floor",
        enum: FloorStatus,
        default: FloorStatus.Active,
    })
    @IsEnum(FloorStatus)
    @IsNotEmpty()
    status: FloorStatus = FloorStatus.Active;
}
