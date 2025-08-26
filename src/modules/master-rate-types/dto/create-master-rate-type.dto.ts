import { ApiProperty } from "@nestjs/swagger";
import {
    IsString,
    Length,
    IsNotEmpty,
    IsInt,
    IsOptional,
    IsEnum,
    IsBoolean,
    IsArray,
    ArrayMinSize,
    IsNumber,
    ValidateNested,
    IsDecimal,
} from "class-validator";
import { Type } from "class-transformer";
import { RoomTypeRateStatus } from "../entities/master_room_type_rates.entity";

export class CreateRoomTypeRateDto {
    @ApiProperty({ description: "Room type ID" })
    @IsInt()
    @IsNotEmpty()
    room_type_id: number;

    @ApiProperty({
        description: "Base rate for this room type",
        type: "number",
        example: 150.0,
    })
    @IsNumber({ maxDecimalPlaces: 2 })
    @IsNotEmpty()
    rack_rate: number;

    @ApiProperty({
        description: "Rate for an extra child",
        type: "number",
        example: 25.0,
        default: 0,
    })
    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    extra_child_rate?: number = 0;

    @ApiProperty({
        description: "Rate for an extra adult",
        type: "number",
        example: 50.0,
        default: 0,
    })
    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    extra_adult_rate?: number = 0;

    @ApiProperty({
        description: "Status of the room type rate",
        enum: RoomTypeRateStatus,
        default: RoomTypeRateStatus.Active,
    })
    @IsOptional()
    @IsEnum(RoomTypeRateStatus)
    status?: RoomTypeRateStatus = RoomTypeRateStatus.Active;
}

export class CreateMasterRateTypeDto {
    @ApiProperty({ description: "ID of the SBU this rate type belongs to" })
    @IsInt()
    @IsNotEmpty()
    sbu_id: number;

    @ApiProperty({
        description: "Name of the rate type",
        required: false,
        maxLength: 255,
    })
    @IsOptional()
    @IsString()
    @Length(1, 255)
    name?: string;

    @ApiProperty({
        description: "Short code for the rate type",
        required: false,
        maxLength: 50,
    })
    @IsOptional()
    @IsString()
    @Length(1, 50)
    short_code?: string;

    // @ApiProperty({
    //     description: "Is this a package rate?",
    //     required: false,
    //     default: false,
    // })
    // @IsOptional()
    // @IsBoolean()
    // is_package?: boolean = false;

    @ApiProperty({
        description: "Is tax included in this rate?",
        required: false,
        default: false,
    })
    @IsOptional()
    @IsBoolean()
    is_tax_included?: boolean = false;

    @ApiProperty({
        description: "Array of room type rates with detailed rate information",
        type: [CreateRoomTypeRateDto],
        required: true,
        example: [
            {
                room_type_id: 1,
                rack_rate: 150.0,
                extra_child_rate: 25.0,
                extra_adult_rate: 50.0,
                status: "Active",
            },
        ],
    })
    @IsArray({ message: "Room type rates must be provided as an array." })
    @ArrayMinSize(1, {
        message: "At least one room type rate must be provided.",
    })
    @ValidateNested({ each: true })
    @Type(() => CreateRoomTypeRateDto)
    room_type_rates: CreateRoomTypeRateDto[];
}
