import { ApiProperty, PartialType } from "@nestjs/swagger";
import {
    IsString,
    Length,
    IsNotEmpty,
    IsInt,
    IsOptional,
    IsEnum,
    IsNumber,
    IsBoolean,
    IsObject,
    Min,
} from "class-validator";
import { Type } from "class-transformer";
import { RoomTypeStatus } from "../entities/master_room_types.entity";

export class CreateMasterRoomTypeDto {
    @ApiProperty({ description: "ID of the SBU this room type belongs to" })
    @IsInt()
    @IsNotEmpty()
    sbu_id: number;

    @ApiProperty({
        description: "Name of the room type (e.g., Standard, Deluxe)",
        maxLength: 255,
    })
    @IsString()
    @IsNotEmpty()
    @Length(1, 255)
    name: string;

    @ApiProperty({
        description: "Short form or abbreviation of the room type name",
        required: false,
        example: "DTR",
        maxLength: 50,
    })
    @IsOptional()
    @IsString()
    @Length(1, 50)
    short_name?: string;

    @ApiProperty({
        description:
            "Detailed description of the room type (e.g., features, amenities)",
        required: false,
        example: "Two beds, AC, Balcony, City View",
    })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({
        description: "Minimum number of adults for this room type",
        example: 2,
        minimum: 0,
    })
    @IsNumber()
    @Min(0)
    @Type(() => Number)
    base_occupancy_adult: number;

    @ApiProperty({
        description: "Minimum number of children for this room type",
        example: 0,
        minimum: 0,
    })
    @IsNumber()
    @Min(0)
    @Type(() => Number)
    base_occupancy_child: number;

    @ApiProperty({
        description: "Maximum number of adults allowed for this room type",
        example: 3,
        minimum: 0,
    })
    @IsNumber()
    @Min(0)
    @Type(() => Number)
    max_occupancy_adult: number;

    @ApiProperty({
        description: "Maximum number of children allowed for this room type",
        example: 2,
        minimum: 0,
    })
    @IsNumber()
    @Min(0)
    @Type(() => Number)
    max_occupancy_child: number;

    @ApiProperty({
        description:
            "Standard price of the room type in local currency (e.g., BDT)",
        type: "number",
        format: "float",
        example: 5500.0,
        minimum: 0,
    })
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    @Type(() => Number)
    base_price: number;

    @ApiProperty({
        description:
            "Higher or seasonal price of the room type in local currency (optional)",
        type: "number",
        format: "float",
        required: false,
        example: 7500.0,
        minimum: 0,
    })
    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    @Type(() => Number)
    higher_price?: number;

    @ApiProperty({
        description: "Standard price of the room type in USD",
        type: "number",
        format: "float",
        example: 50.0,
        minimum: 0,
    })
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    @Type(() => Number)
    base_price_usd: number;

    @ApiProperty({
        description:
            "Higher or seasonal price of the room type in USD (optional)",
        type: "number",
        format: "float",
        required: false,
        example: 70.0,
        minimum: 0,
    })
    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    @Type(() => Number)
    higher_price_usd?: number;

    @ApiProperty({
        description:
            "Indicates whether an extra bed is allowed in this room type",
        example: true,
    })
    @IsBoolean()
    @Type(() => Boolean)
    extra_bed_allowed: boolean;

    @ApiProperty({
        description:
            "Price for an extra bed (optional, only if extra bed allowed)",
        type: "number",
        format: "float",
        required: false,
        example: 1000.0,
        minimum: 0,
    })
    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    @Type(() => Number)
    extra_bed_price?: number;

    @ApiProperty({
        description: "Status of the room type",
        enum: RoomTypeStatus,
        default: RoomTypeStatus.Active,
    })
    @IsEnum(RoomTypeStatus)
    @IsNotEmpty()
    status: RoomTypeStatus = RoomTypeStatus.Active;
}
