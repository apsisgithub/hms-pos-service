import { ApiProperty, PartialType } from "@nestjs/swagger";
import {
    IsNotEmpty,
    IsInt,
    IsOptional,
    IsEnum,
    IsNumber,
} from "class-validator";
import { Type } from "class-transformer";
import { RoomRateStatus } from "../entities/master_room_rates.entity";

export class CreateMasterRoomRateDto {
    @ApiProperty({ description: "ID of the SBU this room rate belongs to" })
    @IsInt()
    @IsNotEmpty()
    sbu_id: number;

    @ApiProperty({ description: "ID of the room type" })
    @IsInt()
    @IsNotEmpty()
    @Type(() => Number)
    room_type_id: number;

    @ApiProperty({ description: "ID of the rate type" })
    @IsInt()
    @IsNotEmpty()
    @Type(() => Number)
    rate_type_id: number;

    @ApiProperty({
        description: "ID of the season (optional)",
        required: false,
    })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    season_id?: number;

    @ApiProperty({
        description: "Price for this room rate",
        required: false,
        type: "number",
        format: "float",
    })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    price?: number;

    @ApiProperty({
        description: "Number of installments allowed",
        required: false,
    })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    installment_count?: number;

    @ApiProperty({
        description: "Price for an extra adult",
        required: false,
        type: "number",
        format: "float",
    })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    extra_adult_price?: number;

    @ApiProperty({
        description: "Price for an extra child",
        required: false,
        type: "number",
        format: "float",
    })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    extra_child_price?: number;

    @ApiProperty({
        description: "Status of the room rate",
        enum: RoomRateStatus,
        default: RoomRateStatus.Active,
    })
    @IsEnum(RoomRateStatus)
    @IsNotEmpty()
    status: RoomRateStatus = RoomRateStatus.Active;
}
