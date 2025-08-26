import { ApiProperty, PartialType } from "@nestjs/swagger";
import {
    IsString,
    Length,
    IsNotEmpty,
    IsInt,
    IsOptional,
    IsEnum,
} from "class-validator";
import { TransportationModeStatus } from "../entities/master_transportation_mode.entity";

export class CreateMasterTransportationModeDto {
    @ApiProperty({
        description: "ID of the SBU this transportation mode belongs to",
    })
    @IsInt()
    @IsNotEmpty()
    sbu_id: number;

    @ApiProperty({
        description: "Name of the transportation mode (e.g., Taxi, Shuttle)",
        maxLength: 255,
    })
    @IsString()
    @IsNotEmpty()
    @Length(1, 255)
    name: string;

    @ApiProperty({
        description: "Color tag for UI display (hex code)",
        required: false,
        maxLength: 10,
    })
    @IsOptional()
    @IsString()
    @Length(1, 10)
    color_code?: string;

    @ApiProperty({
        description: "Description of the transportation mode",
        required: false,
    })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({
        description: "Status of the transportation mode",
        enum: TransportationModeStatus,
        default: TransportationModeStatus.Active,
    })
    @IsEnum(TransportationModeStatus)
    @IsNotEmpty()
    status: TransportationModeStatus = TransportationModeStatus.Active;
}
